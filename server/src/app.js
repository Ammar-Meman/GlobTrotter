import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import stopRoutes, { tripStopRouter } from "./routes/stop.routes.js";
import activityRoutes, { stopActivityRouter } from "./routes/activity.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import cityRoutes from "./routes/city.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

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

app.use(errorHandler);

export default app;
