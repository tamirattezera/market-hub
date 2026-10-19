import { Router } from "express";

export function createHealthRouter(pool) {
  const router = Router();

  router.get("/", async (_req, res) => {
    try {
      await pool.query("SELECT 1");

      return res.status(200).json({
        success: true,
        message: "Market Hub API and database are running",
        checks: {
          api: "ok",
          database: "ok",
        },
      });
    } catch (error) {
      console.error("Database health check failed:", error.message);

      return res.status(503).json({
        success: false,
        message: "Database connection unavailable",
        checks: {
          api: "ok",
          database: "error",
        },
      });
    }
  });

  return router;
}
