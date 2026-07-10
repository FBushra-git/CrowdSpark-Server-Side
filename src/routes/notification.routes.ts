import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { Notification } from "../models/notification.model.js";

const router = Router();
router.get("/", authenticate, async (req, res, next) => {
  try { res.json(await Notification.find({ toEmail: req.user!.email }).sort({ createdAt: -1 })); } catch (error) { next(error); }
});
export default router;
