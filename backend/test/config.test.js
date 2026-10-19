import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getServerConfig,
  getDatabaseConfig,
} from "../src/config.js";

const validEnv = {
  PORT: "5000",
  FRONTEND_URL: "http://localhost:5173",
  DB_HOST: "localhost",
  DB_PORT: "3306",
  DB_NAME: "market_hub",
  DB_USER: "market_hub_app",
  DB_PASSWORD: "test-password",
};

test("server configuration returns validated settings", () => {
  assert.deepEqual(getServerConfig(validEnv), {
    port: 5000,
    frontendUrl: "http://localhost:5173",
  });
});

test("server configuration applies defaults when optional values are absent", () => {
  assert.deepEqual(getServerConfig({}), {
    port: 5000,
    frontendUrl: "http://localhost:5173",
  });
});

test("server configuration rejects an invalid port", () => {
  assert.throws(
    () => getServerConfig({ ...validEnv, PORT: "invalid" }),
    /PORT must be an integer/,
  );
});

test("server configuration rejects ports outside the valid range", () => {
  for (const port of ["0", "65536", "-1"]) {
    assert.throws(
      () => getServerConfig({ ...validEnv, PORT: port }),
      /PORT must be an integer/,
    );
  }
});

test("server configuration rejects a frontend URL containing a path", () => {
  assert.throws(
    () =>
      getServerConfig({
        ...validEnv,
        FRONTEND_URL: "http://localhost:5173/dashboard",
      }),
    /FRONTEND_URL must be a valid HTTP or HTTPS origin/,
  );
});

test("server configuration rejects non-HTTP frontend URLs", () => {
  assert.throws(
    () =>
      getServerConfig({
        ...validEnv,
        FRONTEND_URL: "ftp://localhost:5173",
      }),
    /FRONTEND_URL must be a valid HTTP or HTTPS origin/,
  );
});

test("database configuration returns validated settings", () => {
  assert.deepEqual(getDatabaseConfig(validEnv), {
    host: "localhost",
    port: 3306,
    database: "market_hub",
    user: "market_hub_app",
    password: "test-password",
  });
});

test("database configuration rejects missing required values", () => {
  for (const key of [
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
  ]) {
    const env = { ...validEnv };
    delete env[key];

    assert.throws(
      () => getDatabaseConfig(env),
      new RegExp(`Missing required environment variable: ${key}`),
    );
  }
});

test("database configuration rejects blank required values", () => {
  assert.throws(
    () => getDatabaseConfig({ ...validEnv, DB_PASSWORD: "   " }),
    /Missing required environment variable: DB_PASSWORD/,
  );
});

test("database configuration rejects invalid database ports", () => {
  for (const port of ["abc", "0", "65536"]) {
    assert.throws(
      () => getDatabaseConfig({ ...validEnv, DB_PORT: port }),
      /DB_PORT must be an integer/,
    );
  }
});

test("database configuration defaults the database port to 3306", () => {
  const env = { ...validEnv };
  delete env.DB_PORT;

  assert.equal(getDatabaseConfig(env).port, 3306);
});

test("server configuration accepts a frontend origin with a trailing slash", () => {
  assert.equal(
    getServerConfig({
      ...validEnv,
      FRONTEND_URL: "http://localhost:5173/",
    }).frontendUrl,
    "http://localhost:5173",
  );
});

test("server configuration rejects frontend URLs with query strings or fragments", () => {
  for (const frontendUrl of [
    "http://localhost:5173/?mode=test",
    "http://localhost:5173/#section",
    "http://user:password@localhost:5173",
  ]) {
    assert.throws(
      () => getServerConfig({ ...validEnv, FRONTEND_URL: frontendUrl }),
      /FRONTEND_URL must be a valid HTTP or HTTPS origin/,
    );
  }
});
