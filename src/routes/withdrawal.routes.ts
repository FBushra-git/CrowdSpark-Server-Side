import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Withdrawal } from "../models/withdrawal.model.js";

const router = Router();
router.post("/", authenticate, authorize("creator"), async (req, res, next) => {
  try { res.status(201).json(await Withdrawal.create({ ...req.body, creatorEmail: req.user!.email, creatorName: req.user!.name })); } catch (error) { next(error); }
});
router.get("/mine", authenticate, authorize("creator"), async (req, res, next) => {
  try { res.json(await Withdrawal.find({ creatorEmail: req.user!.email }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});
router.patch("/:id/success", authenticate, authorize("admin"), async (req, res, next) => {
  try { res.json(await Withdrawal.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true })); } catch (error) { next(error); }
});
export default router;
