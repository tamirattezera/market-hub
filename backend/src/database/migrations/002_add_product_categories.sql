-- Add reusable marketplace categories.
CREATE TABLE categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Seed the initial general-marketplace categories.
INSERT INTO categories (name, slug)
VALUES
  ('Electronics', 'electronics'),
  ('Home & Kitchen', 'home-kitchen'),
  ('Clothing', 'clothing'),
  ('Books', 'books'),
  ('Sports & Outdoors', 'sports-outdoors');

-- Initially nullable so existing products remain valid.
ALTER TABLE products
  ADD COLUMN category_id BIGINT UNSIGNED NULL,
  ADD KEY idx_products_category_id (category_id),
  ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT;

UPDATE products
SET category_id = (
  SELECT id
  FROM categories
  WHERE slug = 'electronics'
)
WHERE id = 1;