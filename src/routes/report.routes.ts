import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Campaign } from "../models/campaign.model.js";
import { Report } from "../models/report.model.js";
import { createNotification } from "../utils/notifications.js";

const router = Router();

router.post("/", authenticate, authorize("supporter"), async (req, res, next) => {
  try {
    res.status(201).json(await Report.create({ ...req.body, reporterEmail: req.user!.email, reporterName: req.user!.name }));
  } catch (error) { next(error); }
});

router.get("/", authenticate, authorize("admin"), async (_req, res, next) => {
  try { res.json(await Report.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});

router.patch("/:id/suspend", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    const campaign = await Campaign.findByIdAndUpdate(report.campaignId, { status: "suspended" }, { new: true });
    report.status = "resolved";
    await report.save();
    if (campaign) {
      await createNotification({
        message: `Your campaign ${campaign.title} was suspended after an admin report review.`,
        toEmail: campaign.creatorEmail,
        actionRoute: "/dashboard/campaigns",
        emailSubject: "Campaign suspended",
        emailText: `Your campaign ${campaign.title} was suspended after an admin report review.`
      });
    }
    res.json({ report, campaign });
  } catch (error) { next(error); }
});

router.delete("/:id/campaign", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    const campaign = await Campaign.findByIdAndDelete(report.campaignId);
    report.status = "resolved";
    await report.save();
    res.json({ message: "Reported campaign deleted", report, campaign });
  } catch (error) { next(error); }
});

export default router;
