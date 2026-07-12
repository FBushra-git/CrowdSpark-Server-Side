import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";

const router = Router();

router.get("/stats", authenticate, authorize("admin"), async (_req, res, next) => {
  try {
    const [totalSupporters, totalCreators, creditTotals, paymentTotals] = await Promise.all([
      User.countDocuments({ role: "supporter" }),
      User.countDocuments({ role: "creator" }),
      User.aggregate([{ $group: { _id: null, totalAvailableCredits: { $sum: "$credits" } } }]),
      Payment.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, totalPaymentsProcessed: { $sum: "$amount" } } }])
    ]);

    res.json({
      totalSupporters,
      totalCreators,
      totalAvailableCredits: creditTotals[0]?.totalAvailableCredits || 0,
      totalPaymentsProcessed: paymentTotals[0]?.totalPaymentsProcessed || 0
    });
  } catch (error) { next(error); }
});

router.get("/users", authenticate, authorize("admin"), async (_req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) { next(error); }
});

router.patch("/users/:id", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    if (!["supporter", "creator", "admin"].includes(req.body.role)) return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) { next(error); }
});

router.delete("/users/:id", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User removed", user });
  } catch (error) { next(error); }
});

export default router;
