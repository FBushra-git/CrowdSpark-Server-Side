import "dotenv/config";
import type { Request, Response } from "express";
import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

let databasePromise: Promise<void> | null = null;

function ensureDatabase() {
  if (!databasePromise) databasePromise = connectDatabase();
  return databasePromise;
}

export default async function handler(req: Request, res: Response) {
  await ensureDatabase();
  return app(req, res);
}
