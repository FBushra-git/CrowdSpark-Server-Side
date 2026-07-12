import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Contribution } from "../models/contribution.model.js";
import { Campaign } from "../models/campaign.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "../utils/notifications.js";

const router = Router();

router.get("/supporter/stats", authenticate, authorize("supporter"), async (req, res, next) => {
  try {
    const filter = { supporterEmail: req.user!.email };
    const [totalContributions, pendingContributions, totals] = await Promise.all([
      Contribution.countDocuments(filter),
      Contribution.countDocuments({ ...filter, status: "pending" }),
      Contribution.aggregate([{ $match: filter }, { $group: { _id: null, totalContributedAmount: { $sum: "$contributionAmount" } } }])
    ]);
    res.json({ totalContributions, pendingContributions, totalContributedAmount: totals[0]?.totalContributedAmount || 0 });
  } catch (error) { next(error); }
});

router.get("/supporter", authenticate, authorize("supporter"), async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;
    const filter = { supporterEmail: req.user!.email };
    const [contributions, total] = await Promise.all([
      Contribution.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contribution.countDocuments(filter)
    ]);
    res.json({ contributions, total, page, limit });
  } catch (error) { next(error); }
});

router.get("/creator/pending", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const contributions = await Contribution.find({ creatorEmail: req.user!.email, status: "pending" }).sort({ createdAt: -1 });
    res.json({ contributions });
  } catch (error) { next(error); }
});

router.get("/mine", authenticate, async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;
    const filter = { supporterEmail: req.user!.email };
    const [contributions, total] = await Promise.all([
      Contribution.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contribution.countDocuments(filter)
    ]);
    res.json({ contributions, total, page, limit });
  } catch (error) { next(error); }
});

router.post("/", authenticate, authorize("supporter"), async (req, res, next) => {
  try {
    const supporter = await User.findOne({ email: req.user!.email });
    if (!supporter) return res.status(404).json({ message: "Supporter not found" });
    const contributionAmount = Number(req.body.contributionAmount);
    if (Number.isNaN(contributionAmount) || contributionAmount <= 0) return res.status(400).json({ message: "Contribution amount must be a positive number" });
    if (supporter.credits < contributionAmount) return res.status(400).json({ message: "Insufficient credits to contribute" });

    const contribution = await Contribution.create({ ...req.body, contributionAmount, supporterEmail: req.user!.email, supporterName: req.user!.name });
    supporter.credits = Math.max(0, supporter.credits - contributionAmount);
    await supporter.save();
    await createNotification({
      message: `A new contribution of ${contributionAmount} credits was created for ${req.body.campaignTitle}.`,
      toEmail: req.body.creatorEmail,
      actionRoute: "/dashboard",
      emailSubject: "New contribution received",
      emailText: `Your campaign ${req.body.campaignTitle} received ${contributionAmount} credits from ${req.user!.name}.`
    });
    res.status(201).json(contribution);
  } catch (error) { next(error); }
});

router.patch("/:id/status", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) return res.status(404).json({ message: "Contribution not found" });
    if (contribution.creatorEmail !== req.user!.email) return res.status(403).json({ message: "Not authorized to update this contribution" });
    const status = req.body.status;
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Status must be approved or rejected" });
    if (contribution.status === status) return res.status(200).json(contribution);
    const updatedContribution = await Contribution.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedContribution) return res.status(404).json({ message: "Contribution not found" });
    if (status === "approved") {
      await Campaign.findByIdAndUpdate(contribution.campaignId, { $inc: { amountRaised: contribution.contributionAmount } });
      await User.findOneAndUpdate({ email: contribution.creatorEmail }, { $inc: { raisedCredits: contribution.contributionAmount } });
    }
    if (status === "rejected") {
      await User.findOneAndUpdate({ email: contribution.supporterEmail }, { $inc: { credits: contribution.contributionAmount } });
    }
    await createNotification({
      message: `Your Contribution of ${contribution.contributionAmount} credits to ${contribution.campaignTitle} was ${status} by ${req.user!.name}.`,
      toEmail: contribution.supporterEmail,
      actionRoute: "/dashboard/contributions",
      emailSubject: `Your contribution was ${status}`,
      emailText: `Your contribution of ${contribution.contributionAmount} credits to ${contribution.campaignTitle} was ${status} by ${req.user!.name}.`
    });
    res.json(updatedContribution);
  } catch (error) { next(error); }
});

export default router;
