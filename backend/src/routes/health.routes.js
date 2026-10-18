import { Router } from "express";
import pool from "../database/pool.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      message: "Market Hub API and database are running",
      checks: {
        api: "ok",
        database: "ok",
      },
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
      checks: {
        api: "ok",
        database: "error",
      },
    });
  }
});

export default router;
