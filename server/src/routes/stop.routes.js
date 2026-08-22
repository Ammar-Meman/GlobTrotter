import { Router } from "express";
import * as stopController from "../controllers/stop.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  createStopSchema,
  updateStopSchema,
  reorderStopsSchema,
} from "../validators/stop.validator.js";

const stopRouter = Router();

stopRouter.put("/:id", requireAuth, validateBody(updateStopSchema), stopController.updateStop);
stopRouter.delete("/:id", requireAuth, stopController.deleteStop);

export const tripStopRouter = Router({ mergeParams: true });

tripStopRouter.post("/:tripId/stops", requireAuth, validateBody(createStopSchema), stopController.createStop);
tripStopRouter.put("/:tripId/stops/reorder", requireAuth, validateBody(reorderStopsSchema), stopController.reorderStops);

export default stopRouter;
