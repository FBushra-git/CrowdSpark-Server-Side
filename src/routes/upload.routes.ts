import { Router } from "express";
import axios from "axios";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed"));
    cb(null, true);
  }
});

router.post("/imgbb", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    const key = process.env.IMGBB_API_KEY;
    if (!key) return res.status(500).json({ message: "IMGBB_API_KEY is missing" });

    const form = new FormData();
    form.append("image", req.file.buffer.toString("base64"));

    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${key}`, form);
    res.json({ url: response.data.data.url });
  } catch (error) { next(error); }
});

export default router;
