import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app, { createApp } from "../src/app.js";

test("unknown API routes return a consistent 404 response", async () => {
  const response = await request(app).get("/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    success: false,
    message: "API route not found",
  });
});

test("health endpoint reports a healthy database", async () => {
  const fakePool = {
    async query(sql) {
      assert.equal(sql, "SELECT 1");
      return [[{ 1: 1 }], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.deepEqual(response.body.checks, {
    api: "ok",
    database: "ok",
  });
});

test("health endpoint returns a safe 503 response when the database fails", async () => {
  const fakePool = {
    async query() {
      throw new Error("Internal database connection details");
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get("/api/health");

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    success: false,
    message: "Database connection unavailable",
    checks: {
      api: "ok",
      database: "error",
    },
  });
  assert.equal(
    JSON.stringify(response.body).includes(
      "Internal database connection details",
    ),
    false,
  );
});

test("products endpoint searches and filters by category", async () => {
  const expectedProduct = {
    id: 1,
    name: "Wireless Headphones",
    description: "Bluetooth headphones",
    price: "49.99",
    stock_quantity: 10,
    category_id: 2,
    category_name: "Electronics",
    category_slug: "electronics",
  };

  const fakePool = {
    async query(sql, params) {
      assert.match(sql, /p\.name LIKE \?/);
      assert.match(sql, /p\.description LIKE \?/);
      assert.match(sql, /c\.slug = \?/);
      assert.deepEqual(params, ["%headphones%", "%headphones%", "electronics"]);

      return [[expectedProduct], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get(
    "/api/products?q=headphones&category=electronics",
  );

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: [expectedProduct],
  });
});

test("products endpoint rejects repeated search parameters", async () => {
  let databaseCalled = false;

  const fakePool = {
    async query() {
      databaseCalled = true;
      return [[], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get("/api/products?q=phone&q=tablet");

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Search query must be a single string",
  });
  assert.equal(databaseCalled, false);
});

test("products endpoint returns a safe error when the database fails", async () => {
  const fakePool = {
    async query() {
      throw new Error("Internal database connection details");
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get("/api/products");

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    success: false,
    message: "Unable to retrieve products",
  });
  assert.equal(
    JSON.stringify(response.body).includes(
      "Internal database connection details",
    ),
    false,
  );
});

test("categories endpoint returns categories from the database", async () => {
  const expectedCategories = [
    { id: 1, name: "Electronics", slug: "electronics" },
    { id: 3, name: "Clothing", slug: "clothing" },
  ];

  const fakePool = {
    async query(sql) {
      assert.match(sql, /SELECT id, name, slug/);
      assert.match(sql, /FROM categories/);
      assert.match(sql, /ORDER BY name ASC/);

      return [expectedCategories, []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get("/api/categories");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: expectedCategories,
  });
});

test("categories endpoint returns a safe error when the database fails", async () => {
  const fakePool = {
    async query() {
      throw new Error("Internal database connection details");
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get("/api/categories");

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    success: false,
    message: "Unable to retrieve categories",
  });
  assert.equal(
    JSON.stringify(response.body).includes(
      "Internal database connection details",
    ),
    false,
  );
});

test("products endpoint rejects repeated category parameters", async () => {
  let databaseCalled = false;

  const fakePool = {
    async query() {
      databaseCalled = true;
      return [[], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get(
    "/api/products?category=electronics&category=clothing",
  );

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Category must be a single string",
  });
  assert.equal(databaseCalled, false);
});

test("products endpoint rejects search terms longer than 100 characters", async () => {
  let databaseCalled = false;

  const fakePool = {
    async query() {
      databaseCalled = true;
      return [[], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const longQuery = "a".repeat(101);
  const response = await request(testApp).get(`/api/products?q=${longQuery}`);

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Search query must not exceed 100 characters",
  });
  assert.equal(databaseCalled, false);
});

test("products endpoint rejects invalid category slugs", async () => {
  let databaseCalled = false;

  const fakePool = {
    async query() {
      databaseCalled = true;
      return [[], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get(
    "/api/products?category=Electronics%20%26%20More",
  );

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Category must be a valid category slug",
  });
  assert.equal(databaseCalled, false);
});

test("products endpoint accepts a search term of exactly 100 characters", async () => {
  const searchTerm = "a".repeat(100);
  const expectedPattern = `%${searchTerm}%`;

  const fakePool = {
    async query(sql, params) {
      assert.match(sql, /p\.name LIKE \?/);
      assert.deepEqual(params, [expectedPattern, expectedPattern]);
      return [[], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get(`/api/products?q=${searchTerm}`);

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: [],
  });
});

test("products endpoint accepts a valid category slug", async () => {
  const fakePool = {
    async query(sql, params) {
      assert.match(sql, /c\.slug = \?/);
      assert.deepEqual(params, ["home-kitchen"]);
      return [[], []];
    },
  };

  const testApp = createApp({ dbPool: fakePool });
  const response = await request(testApp).get(
    "/api/products?category=home-kitchen",
  );

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: [],
  });
});
