import { Router } from "express";
import * as budgetController from "../controllers/budget.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

// GET /api/trips/:tripId/budget
router.get("/:tripId/budget", requireAuth, budgetController.getTripBudget);

export default router;
