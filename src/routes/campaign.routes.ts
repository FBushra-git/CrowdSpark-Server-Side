import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Campaign } from "../models/campaign.model.js";
import { Contribution } from "../models/contribution.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "../utils/notifications.js";

const router = Router();

function parseSort(sortParam: unknown): Record<string, 1 | -1> {
  const sortKey = typeof sortParam === "string" ? sortParam : "deadline";
  if (sortKey.startsWith("-")) return { [sortKey.slice(1)]: -1 as const };
  return { [sortKey]: 1 as const };
}

async function notifyCampaignStatus(campaign: any, status: "approved" | "rejected" | "suspended") {
  await createNotification({
    message: `Your campaign ${campaign.title} was ${status} by the admin.`,
    toEmail: campaign.creatorEmail,
    actionRoute: "/dashboard/campaigns",
    emailSubject: `Campaign ${status}`,
    emailText: `Your campaign ${campaign.title} has been ${status} by the admin.`
  });
}

async function getCreatorCampaigns(req: any, res: any, next: any) {
  try {
    const campaigns = await Campaign.find({ creatorEmail: req.user!.email }).sort({ deadline: -1 });
    res.json({ campaigns });
  } catch (error) { next(error); }
}

router.get("/creator/stats", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const now = new Date();
    const filter = { creatorEmail: req.user!.email };
    const [totalCampaigns, activeCampaigns, totals] = await Promise.all([
      Campaign.countDocuments(filter),
      Campaign.countDocuments({ ...filter, deadline: { $gte: now } }),
      Campaign.aggregate([{ $match: filter }, { $group: { _id: null, totalRaised: { $sum: "$amountRaised" } } }])
    ]);
    res.json({ totalCampaigns, activeCampaigns, totalRaised: totals[0]?.totalRaised || 0 });
  } catch (error) { next(error); }
});

router.get("/creator", authenticate, authorize("creator"), getCreatorCampaigns);
router.get("/creator/mine", authenticate, authorize("creator"), getCreatorCampaigns);

router.get("/pending", authenticate, authorize("admin"), async (_req, res, next) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ campaigns });
  } catch (error) { next(error); }
});

router.get("/admin/all", authenticate, authorize("admin"), async (_req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ campaigns });
  } catch (error) { next(error); }
});

router.patch("/creator/:id", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.creatorEmail !== req.user!.email) return res.status(403).json({ message: "Not authorized to update this campaign" });
    const updates: Record<string, unknown> = {};
    if (typeof req.body.title === "string") updates.title = req.body.title;
    if (typeof req.body.story === "string") updates.story = req.body.story;
    if (typeof req.body.rewardInfo === "string") updates.rewardInfo = req.body.rewardInfo;
    res.json(await Campaign.findByIdAndUpdate(req.params.id, updates, { new: true }));
  } catch (error) { next(error); }
});

router.post("/creator/:id/updates", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.creatorEmail !== req.user!.email) return res.status(403).json({ message: "Not authorized to update this campaign" });
    const title = String(req.body.title || "Campaign Update").trim();
    const message = String(req.body.message || "").trim();
    if (!message) return res.status(400).json({ message: "Update message is required" });
    campaign.updates.unshift({ title, message, createdAt: new Date() } as any);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) { next(error); }
});

router.delete("/creator/:id", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.creatorEmail !== req.user!.email) return res.status(403).json({ message: "Not authorized to delete this campaign" });
    const approvedContributions = await Contribution.find({ campaignId: campaign._id, status: "approved" });
    await Promise.all(approvedContributions.map((contribution) => User.findOneAndUpdate({ email: contribution.supporterEmail }, { $inc: { credits: contribution.contributionAmount } })));
    const refundedCredits = approvedContributions.reduce((sum, contribution) => sum + contribution.contributionAmount, 0);
    await User.findOneAndUpdate({ email: campaign.creatorEmail }, { $inc: { raisedCredits: -refundedCredits } });
    await Contribution.updateMany({ campaignId: campaign._id, status: "approved" }, { status: "rejected" });
    await Campaign.findByIdAndDelete(campaign._id);
    res.json({ message: "Campaign deleted and approved supporters refunded", refundedCredits });
  } catch (error) { next(error); }
});

router.get("/active", async (_req, res, next) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" }).limit(10).sort({ deadline: -1 });
    res.json({ campaigns });
  } catch (error) { next(error); }
});

router.get("/", async (req, res, next) => {
  try {
    const { search, category, status, minGoal, maxGoal, deadlineFrom, deadlineTo, page = "1", limit = "8", sort = "deadline" } = req.query;
    const match: Record<string, unknown> = {};
    if (status) match.status = status;
    else match.status = "approved";
    if (category) match.category = category;
    if (search) match.title = { $regex: search, $options: "i" };
    if (minGoal || maxGoal) {
      match.fundingGoal = {} as any;
      if (minGoal) (match.fundingGoal as any).$gte = Number(minGoal);
      if (maxGoal) (match.fundingGoal as any).$lte = Number(maxGoal);
    }
    if (deadlineFrom || deadlineTo) {
      match.deadline = {} as any;
      if (deadlineFrom) (match.deadline as any).$gte = new Date(String(deadlineFrom));
      if (deadlineTo) (match.deadline as any).$lte = new Date(String(deadlineTo));
    }
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const result = await Campaign.aggregate([
      { $match: match },
      { $sort: parseSort(sort) },
      { $facet: { campaigns: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize }], total: [{ $count: "count" }] } }
    ]);
    res.json({ campaigns: result[0]?.campaigns || [], total: result[0]?.total?.[0]?.count || 0, page: pageNumber, limit: pageSize });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try { res.json(await Campaign.findById(req.params.id)); } catch (error) { next(error); }
});

router.post("/", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const campaign = await Campaign.create({ ...req.body, creatorName: req.user!.name, creatorEmail: req.user!.email, status: "pending" });
    res.status(201).json(campaign);
  } catch (error) { next(error); }
});

router.patch("/:id/status", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const status = req.body.status;
    if (!["approved", "rejected", "suspended"].includes(status)) return res.status(400).json({ message: "Invalid status" });
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    await notifyCampaignStatus(campaign, status);
    res.json(campaign);
  } catch (error) { next(error); }
});

router.patch("/:id/approve", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    await notifyCampaignStatus(campaign, "approved");
    res.json(campaign);
  } catch (error) { next(error); }
});

router.patch("/:id/reject", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    await notifyCampaignStatus(campaign, "rejected");
    res.json(campaign);
  } catch (error) { next(error); }
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    await Contribution.updateMany({ campaignId: campaign._id }, { status: "rejected" });
    res.json({ message: "Campaign deleted", campaign });
  } catch (error) { next(error); }
});

export default router;
