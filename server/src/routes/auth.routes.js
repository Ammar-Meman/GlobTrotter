import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validateBody(signupSchema), authController.signup);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/forgot-password", validateBody(forgotPasswordSchema), authController.forgotPassword);
router.get("/me", requireAuth, authController.getMe);

export default router;
