import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controllers/admin.controller.js";

const router = Router();

// GET /api/admin/stats — protected, admin-only
router.get("/stats", requireAuth, requireAdmin, getStats);

export default router;
