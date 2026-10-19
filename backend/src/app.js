import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import productsRouter from "./routes/products.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
  }),
);

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default app;
