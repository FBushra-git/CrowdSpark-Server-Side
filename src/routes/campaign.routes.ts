import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Campaign } from "../models/campaign.model.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search, category, status = "approved", sort = "deadline", page = "1", limit = "8" } = req.query;
    const query: Record<string, unknown> = { status };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };
    const skip = (Number(page) - 1) * Number(limit);
    const campaigns = await Campaign.find(query).sort(String(sort)).skip(skip).limit(Number(limit));
    const total = await Campaign.countDocuments(query);
    res.json({ campaigns, total });
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
  try { res.json(await Campaign.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (error) { next(error); }
});

export default router;
