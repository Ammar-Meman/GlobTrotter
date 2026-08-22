import { Router } from "express";
import * as cityController from "../controllers/city.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/cities/search?q=...
router.get("/search", requireAuth, cityController.searchCities);

// GET /api/cities/:cityName/image
router.get("/:cityName/image", requireAuth, cityController.getCityImage);

export default router;
