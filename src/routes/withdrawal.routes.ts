import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Withdrawal } from "../models/withdrawal.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "../utils/notifications.js";

const router = Router();

router.post("/", authenticate, authorize("creator"), async (req, res, next) => {
  try {
    const creator = await User.findOne({ email: req.user!.email });
    if (!creator) return res.status(404).json({ message: "Creator not found" });
    const withdrawalCredit = Number(req.body.withdrawalCredit);
    if (withdrawalCredit < 200) return res.status(400).json({ message: "Minimum withdrawal is 200 credits" });
    if (withdrawalCredit > creator.raisedCredits) return res.status(400).json({ message: "Not enough raised credits" });
    const withdrawalAmount = Number((withdrawalCredit / 20).toFixed(2));
    const withdrawal = await Withdrawal.create({ ...req.body, creatorEmail: req.user!.email, creatorName: req.user!.name, withdrawalCredit, withdrawalAmount, status: "pending" });
    await createNotification({
      message: `A withdrawal request for ${withdrawalCredit} credits was submitted by ${req.user!.name}.`,
      toEmail: process.env.ADMIN_NOTIFICATION_EMAIL || req.user!.email,
      actionRoute: "/dashboard/admin/withdrawals",
      emailSubject: "Withdrawal request submitted",
      emailText: `${req.user!.name} has requested a withdrawal of ${withdrawalCredit} credits. Please review the request.`
    });
    res.status(201).json(withdrawal);
  } catch (error) { next(error); }
});

router.get("/pending", authenticate, authorize("admin"), async (_req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ withdrawals });
  } catch (error) { next(error); }
});

router.get("/mine", authenticate, authorize("creator"), async (req, res, next) => {
  try { res.json(await Withdrawal.find({ creatorEmail: req.user!.email }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});

async function approveWithdrawal(req: any, res: any, next: any) {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });
    if (withdrawal.status !== "pending") return res.status(400).json({ message: "Withdrawal is not pending" });
    const updated = await Withdrawal.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    await User.findOneAndUpdate({ email: withdrawal.creatorEmail }, { $inc: { raisedCredits: -withdrawal.withdrawalCredit } });
    await createNotification({
      message: `Your withdrawal request for ${withdrawal.withdrawalCredit} credits has been approved.`,
      toEmail: withdrawal.creatorEmail,
      actionRoute: "/dashboard/payment-history",
      emailSubject: "Withdrawal approved",
      emailText: `Your withdrawal for ${withdrawal.withdrawalCredit} credits has been approved.`
    });
    res.json(updated);
  } catch (error) { next(error); }
}

router.patch("/:id/approve", authenticate, authorize("admin"), approveWithdrawal);
router.patch("/:id/success", authenticate, authorize("admin"), approveWithdrawal);

router.patch("/:id/reject", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });
    if (withdrawal.status !== "pending") return res.status(400).json({ message: "Withdrawal is not pending" });
    const updated = await Withdrawal.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    await createNotification({
      message: `Your withdrawal request for ${withdrawal.withdrawalCredit} credits has been rejected.`,
      toEmail: withdrawal.creatorEmail,
      actionRoute: "/dashboard/payment-history",
      emailSubject: "Withdrawal rejected",
      emailText: `Your withdrawal of ${withdrawal.withdrawalCredit} credits was rejected by the admin.`
    });
    res.json(updated);
  } catch (error) { next(error); }
});

export default router;
