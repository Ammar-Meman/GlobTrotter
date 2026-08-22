import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import stopRoutes, { tripStopRouter } from "./routes/stop.routes.js";
import activityRoutes, { stopActivityRouter } from "./routes/activity.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import cityRoutes from "./routes/city.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — restrict to configured origin(s) ───────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / non-browser requests (e.g. Postman in dev)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

// ── Body size limit (prevents JSON-body DoS) ──────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ── Global rate limiter — broad protection against flooding ───────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many requests, please try again later." },
  },
});
app.use(globalLimiter);

// ── Strict rate limiter for sensitive auth endpoints ──────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "GlobeTrotter API is running" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips", tripStopRouter);
app.use("/api/trips", budgetRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/stops", stopActivityRouter);
app.use("/api/activities", activityRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
