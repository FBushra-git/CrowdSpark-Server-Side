import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { User } from "../models/user.model.js";

const router = Router();
router.get("/", authenticate, authorize("admin"), async (_req, res, next) => {
  try { res.json(await User.find().select("-passwordHash")); } catch (error) { next(error); }
});
router.patch("/:id/role", authenticate, authorize("admin"), async (req, res, next) => {
  try { res.json(await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-passwordHash")); } catch (error) { next(error); }
});
export default router;
