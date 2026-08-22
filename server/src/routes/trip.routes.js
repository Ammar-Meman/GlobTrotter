import { Router } from "express";
import * as tripController from "../controllers/trip.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  createTripSchema,
  updateTripSchema,
} from "../validators/trip.validator.js";

const router = Router();

router.use(requireAuth);

router.post("/", validateBody(createTripSchema), tripController.createTrip);
router.get("/", tripController.getTrips);
router.get("/:id", tripController.getTripById);
router.put("/:id", validateBody(updateTripSchema), tripController.updateTrip);
router.delete("/:id", tripController.deleteTrip);

export default router;
