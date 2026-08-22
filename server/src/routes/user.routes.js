import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  updateProfileSchema,
  createSavedDestinationSchema,
  deleteAccountSchema,
} from "../validators/user.validator.js";

const router = Router();

router.use(requireAuth);

router.put("/me", validateBody(updateProfileSchema), userController.updateMe);
router.delete("/me", validateBody(deleteAccountSchema), userController.deleteMe);

router.get("/me/saved-destinations", userController.getSavedDestinations);
router.post(
  "/me/saved-destinations",
  validateBody(createSavedDestinationSchema),
  userController.addSavedDestination
);
router.delete("/me/saved-destinations/:id", userController.deleteSavedDestination);

export default router;
