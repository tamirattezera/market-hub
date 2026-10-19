import { Router } from "express";
import pool from "../database/pool.js";

const router = Router();

router.get("/", async (req, res) => {
  const rawQuery = req.query.q;
  const rawCategory = req.query.category;

  if (rawQuery !== undefined && typeof rawQuery !== "string") {
    return res.status(400).json({
      success: false,
      message: "Search query must be a single string",
    });
  }

  if (rawCategory !== undefined && typeof rawCategory !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category must be a single string",
    });
  }

  const searchTerm = rawQuery?.trim() ?? "";
  const categorySlug = rawCategory?.trim() ?? "";

  if (searchTerm.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Search query must not exceed 100 characters",
    });
  }

  if (
    categorySlug.length > 100 ||
    (categorySlug !== "" &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(categorySlug))
  ) {
    return res.status(400).json({
      success: false,
      message: "Category must be a valid category slug",
    });
  }

  try {
    const conditions = [];
    const params = [];

    if (searchTerm) {
      const searchPattern = `%${searchTerm}%`;

      conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      params.push(searchPattern, searchPattern);
    }

    if (categorySlug) {
      conditions.push("c.slug = ?");
      params.push(categorySlug);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const [products] = await pool.query(
      `
        SELECT
          p.id,
          p.name,
          p.description,
          p.price,
          p.stock_quantity,
          p.created_at,
          p.updated_at,
          c.id AS category_id,
          c.name AS category_name,
          c.slug AS category_slug
        FROM products AS p
        LEFT JOIN categories AS c ON c.id = p.category_id
        ${whereClause}
        ORDER BY p.created_at DESC, p.id DESC
      `,
      params,
    );

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
