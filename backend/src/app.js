import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
  }),
);

app.use(express.json());

app.use("/api/health", healthRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default app;
