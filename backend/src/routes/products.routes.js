import { Router } from "express";
import pool from "../database/pool.js";

const router = Router();

router.get("/", async (req, res) => {
  const rawQuery = req.query.q;

  if (rawQuery !== undefined && typeof rawQuery !== "string") {
    return res.status(400).json({
      success: false,
      message: "Search query must be a single string",
    });
  }

  const searchTerm = rawQuery?.trim() ?? "";

  if (searchTerm.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Search query must not exceed 100 characters",
    });
  }

  try {
    let products;

    if (searchTerm) {
      const searchPattern = `%${searchTerm}%`;

      [products] = await pool.query(
        `
          SELECT
            id,
            name,
            description,
            price,
            stock_quantity,
            created_at,
            updated_at
          FROM products
          WHERE name LIKE ? OR description LIKE ?
          ORDER BY created_at DESC, id DESC
        `,
        [searchPattern, searchPattern],
      );
    } else {
      [products] = await pool.query(`
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
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve products",
    });
  }
});

export default router;
