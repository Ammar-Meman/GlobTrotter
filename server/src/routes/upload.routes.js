import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post("/", requireAuth, upload.single("file"), uploadController.uploadFile);

export default router;
