import { Router } from "express";
import * as tripController from "../controllers/trip.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  createTripSchema,
  updateTripSchema,
} from "../validators/trip.validator.js";

const router = Router();

// Public sharing route (no auth required)
router.get("/public/:shareId", tripController.getPublicTrip);

// Protected routes
router.post("/", requireAuth, validateBody(createTripSchema), tripController.createTrip);
router.get("/", requireAuth, tripController.getTrips);
router.get("/:id", requireAuth, tripController.getTripById);
router.post("/:id/copy", requireAuth, tripController.copyTrip);
router.put("/:id", requireAuth, validateBody(updateTripSchema), tripController.updateTrip);
router.delete("/:id", requireAuth, tripController.deleteTrip);

export default router;
