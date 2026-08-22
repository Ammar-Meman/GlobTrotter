import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// SECURITY: Only accept known image MIME types — reject all other files.
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error("Only image files are allowed (jpeg, png, gif, webp, svg)"), {
        statusCode: 400,
        code: "UNSUPPORTED_FILE_TYPE",
      }),
      false
    );
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit (reduced from 10 MB)
    files: 1,
  },
  fileFilter,
});

router.post("/", requireAuth, upload.single("file"), uploadController.uploadFile);

export default router;
