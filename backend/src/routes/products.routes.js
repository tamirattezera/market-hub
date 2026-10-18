import { Router } from "express";
import pool from "../database/pool.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        stock_quantity,
        created_at,
        updated_at
      FROM products
      ORDER BY created_at DESC, id DESC
    `);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve products",
    });
  }
});

export default router;
