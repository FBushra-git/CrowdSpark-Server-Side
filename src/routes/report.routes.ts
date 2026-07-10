import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Report } from "../models/report.model.js";

const router = Router();
router.post("/", authenticate, authorize("supporter"), async (req, res, next) => {
  try { res.status(201).json(await Report.create({ ...req.body, reporterEmail: req.user!.email, reporterName: req.user!.name })); } catch (error) { next(error); }
});
router.get("/", authenticate, authorize("admin"), async (_req, res, next) => {
  try { res.json(await Report.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});
export default router;
