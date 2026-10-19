import { Router } from "express";
import pool from "../database/pool.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT id, name, slug
      FROM categories
      ORDER BY name ASC
    `);

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve categories",
    });
  }
});

export default router;
