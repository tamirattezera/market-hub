import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./database/pool.js";
import { createHealthRouter } from "./routes/health.routes.js";
import { createProductsRouter } from "./routes/products.routes.js";
import { createCategoriesRouter } from "./routes/categories.routes.js";

export function createApp({ dbPool = pool } = {}) {
  const app = express();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  app.use(
    cors({
      origin: frontendUrl,
    }),
  );

  app.use(express.json());

  app.use("/api/health", createHealthRouter(dbPool));
  app.use("/api/products", createProductsRouter(dbPool));
  app.use("/api/categories", createCategoriesRouter(dbPool));

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  return app;
}

const app = createApp();

export default app;
