import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../validators/auth.validator.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many authentication attempts, please try again later.",
    },
  },
});

const router = Router();

router.post("/signup", authLimiter, validateBody(signupSchema), authController.signup);
router.post("/login", authLimiter, validateBody(loginSchema), authController.login);
router.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.get("/me", requireAuth, authController.getMe);

export default router;
