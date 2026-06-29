import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import attachmentRoutes from "./routes/attachmentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/auth.js";

/* Configuration */
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* Health check (used by the load balancer / uptime checks) */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (_req, res) => {
  res.send("Project Management API");
});

/* Routes (protected by Cognito JWT when AUTH_ENABLED=true) */
app.use("/projects", requireAuth, projectRoutes);
app.use("/tasks", requireAuth, taskRoutes);
app.use("/search", requireAuth, searchRoutes);
app.use("/users", requireAuth, userRoutes);
app.use("/teams", requireAuth, teamRoutes);
app.use("/comments", requireAuth, commentRoutes);
app.use("/attachments", requireAuth, attachmentRoutes);

/* 404 + central error handling (must be registered last) */
app.use(notFound);
app.use(errorHandler);

/* Server */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
