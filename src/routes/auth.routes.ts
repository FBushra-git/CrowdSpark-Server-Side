import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/user.model.js";

const router = Router();
const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), photoUrl: z.string().url(), role: z.enum(["supporter", "creator"]) });

function sign(user: any) {
  return jwt.sign({ id: user._id.toString(), email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, passwordHash, credits: data.role === "creator" ? 20 : 50 });
    res.status(201).json({ user, token: sign(user) });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ user, token: sign(user) });
  } catch (error) { next(error); }
});

export default router;
