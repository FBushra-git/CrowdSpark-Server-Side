import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { authenticate, getJwtSecret } from "../middleware/auth.js";
import { User } from "../models/user.model.js";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: passwordSchema,
  photoUrl: z.string().url(),
  role: z.enum(["supporter", "creator"])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const googleSchema = z.object({
  credential: z.string().min(20),
  role: z.enum(["supporter", "creator"]).default("supporter")
});

function sanitizeUser(user: any) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl,
    role: user.role,
    credits: user.credits,
    raisedCredits: user.raisedCredits,
    authProvider: user.authProvider
  };
}

function sign(user: any) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      photoUrl: data.photoUrl,
      role: data.role,
      authProvider: "credentials",
      credits: data.role === "creator" ? 20 : 50
    });
    res.status(201).json({ user: sanitizeUser(user), token: sign(user) });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ user: sanitizeUser(user), token: sign(user) });
  } catch (error) { next(error); }
});

router.post("/google", async (req, res, next) => {
  try {
    const data = googleSchema.parse(req.body);
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return res.status(500).json({ message: "GOOGLE_CLIENT_ID is not configured" });

    const ticket = await googleClient.verifyIdToken({ idToken: data.credential, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) return res.status(401).json({ message: "Google account email is not verified" });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        passwordHash: "",
        authProvider: "google",
        photoUrl: payload.picture || "https://i.ibb.co/6P9xV4h/avatar-creator.png",
        role: data.role,
        credits: data.role === "creator" ? 20 : 50
      });
    }

    res.json({ user: sanitizeUser(user), token: sign(user) });
  } catch (error) { next(error); }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: sanitizeUser(user) });
  } catch (error) { next(error); }
});

export default router;
