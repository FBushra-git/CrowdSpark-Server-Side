import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Payment } from "../models/payment.model.js";

const router = Router();
router.post("/dummy", authenticate, authorize("supporter"), async (req, res, next) => {
  try { res.status(201).json(await Payment.create({ ...req.body, userEmail: req.user!.email, userName: req.user!.name, transactionId: `dummy-${Date.now()}` })); } catch (error) { next(error); }
});
router.get("/mine", authenticate, async (req, res, next) => {
  try { res.json(await Payment.find({ userEmail: req.user!.email }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});
export default router;
