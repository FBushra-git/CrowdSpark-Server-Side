import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Contribution } from "../models/contribution.model.js";

const router = Router();
router.get("/mine", authenticate, async (req, res, next) => {
  try { res.json(await Contribution.find({ supporterEmail: req.user!.email }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});
router.post("/", authenticate, authorize("supporter"), async (req, res, next) => {
  try { res.status(201).json(await Contribution.create({ ...req.body, supporterEmail: req.user!.email, supporterName: req.user!.name })); } catch (error) { next(error); }
});
router.patch("/:id/status", authenticate, authorize("creator"), async (req, res, next) => {
  try { res.json(await Contribution.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (error) { next(error); }
});
export default router;
