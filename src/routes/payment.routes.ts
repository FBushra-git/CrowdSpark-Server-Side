import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { Withdrawal } from "../models/withdrawal.model.js";

const router = Router();

router.post("/dummy", authenticate, authorize("supporter"), async (req, res, next) => {
  try {
    res.status(201).json(
      await Payment.create({
        ...req.body,
        userEmail: req.user!.email,
        userName: req.user!.name,
        transactionId: `dummy-${Date.now()}`
      })
    );
  } catch (error) { next(error); }
});

router.get("/mine", authenticate, async (req, res, next) => {
  try {
    res.json(await Payment.find({ userEmail: req.user!.email }).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.get("/history", authenticate, async (req, res, next) => {
  try {
    const [payments, withdrawals] = await Promise.all([
      Payment.find({ userEmail: req.user!.email }).lean(),
      Withdrawal.find({ creatorEmail: req.user!.email }).lean()
    ]);

    const purchaseRecords = payments.map((payment) => ({
      _id: payment._id.toString(),
      createdAt: payment.createdAt,
      paymentCredit: payment.credits,
      paymentAmount: payment.amount,
      paymentSystem: payment.paymentMethod || payment.provider || "Stripe",
      status: payment.status,
      type: "purchase" as const
    }));

    const withdrawalRecords = withdrawals.map((withdrawal) => ({
      _id: withdrawal._id.toString(),
      createdAt: withdrawal.createdAt,
      withdrawalCredit: withdrawal.withdrawalCredit,
      withdrawalAmount: withdrawal.withdrawalAmount,
      paymentSystem: withdrawal.paymentSystem,
      accountNumber: withdrawal.accountNumber,
      status: withdrawal.status,
      type: "withdrawal" as const
    }));

    const records = [...purchaseRecords, ...withdrawalRecords].sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
    res.json({ payments: records });
  } catch (error) { next(error); }
});

router.post("/stripe-checkout", authenticate, async (req, res, next) => {
  try {
    const { packageId, credits, amount } = req.body;
    if (!packageId || !credits || !amount) return res.status(400).json({ message: "Missing payment details" });
    if (!req.body.card) return res.status(400).json({ message: "Card details required" });

    const user = await User.findOne({ email: req.user!.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactionId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const updatedUser = await User.findOneAndUpdate({ email: req.user!.email }, { $inc: { credits } }, { new: true });
    const payment = await Payment.create({
      userEmail: req.user!.email,
      userName: user.name,
      amount: amount / 100,
      credits,
      packageId,
      status: "paid",
      paymentMethod: "stripe",
      transactionId,
      description: `Purchased ${credits} credits - ${packageId} package`
    });

    res.json({ success: true, message: "Payment successful", credits: updatedUser?.credits || 0, transaction: payment });
  } catch (error) { next(error); }
});

router.get("/stats", authenticate, async (req, res, next) => {
  try {
    const payments = await Payment.find({ userEmail: req.user!.email });
    const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalCredits = payments.reduce((sum, p) => sum + (p.credits || 0), 0);
    res.json({ totalSpent, totalCredits, transactionCount: payments.length, lastTransaction: payments[0] || null });
  } catch (error) { next(error); }
});

export default router;
