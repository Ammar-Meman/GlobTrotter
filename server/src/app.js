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

// Trust reverse proxy headers on Render / cloud deployments
app.set("trust proxy", 1);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — restrict to configured origin(s) ───────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174,https://globaltrotter-pixelpwnz.vercel.app")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / non-browser requests (e.g. Postman in dev)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((allowed) => allowed === "*" || origin.startsWith(allowed) || allowed === origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

// ── Body size limit (prevents JSON-body DoS) ──────────────────────────────────
app.use(express.json({ limit: "2mb" }));

// ── Global rate limiter — broad protection against flooding ───────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many requests, please try again later." },
  },
});
app.use(globalLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "GlobeTrotter API is running" });
});

app.use("/api/auth", authRoutes);
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
