import { Router } from "express";
import * as activityController from "../controllers/activity.controller.js";
import * as activityDiscoveryController from "../controllers/activityDiscovery.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  createActivitySchema,
  updateActivitySchema,
  reorderActivitiesSchema,
} from "../validators/activity.validator.js";

const activityRouter = Router();

// GET /api/activities/search?city=...&type=...&maxCost=...
activityRouter.get("/search", requireAuth, activityDiscoveryController.searchActivities);

activityRouter.put("/:id", requireAuth, validateBody(updateActivitySchema), activityController.updateActivity);
activityRouter.delete("/:id", requireAuth, activityController.deleteActivity);

export const stopActivityRouter = Router({ mergeParams: true });

stopActivityRouter.post(
  "/:stopId/activities",
  requireAuth,
  validateBody(createActivitySchema),
  activityController.createActivity
);
stopActivityRouter.put(
  "/:stopId/activities/reorder",
  requireAuth,
  validateBody(reorderActivitiesSchema),
  activityController.reorderActivities
);

export default activityRouter;
