import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type UserRole = "supporter" | "creator" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
  }
  return secret;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication token missing" });
  try {
    req.user = jwt.verify(token, getJwtSecret()) as AuthUser;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

export const requireSupporter = [authenticate, authorize("supporter")];
export const requireCreator = [authenticate, authorize("creator")];
export const requireAdmin = [authenticate, authorize("admin")];
