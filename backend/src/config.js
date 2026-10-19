import "dotenv/config";

function requiredString(env, key) {
  const value = env[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
}

function readPort(env, key, defaultValue) {
  const rawValue = env[key] ?? String(defaultValue);

  if (!/^\d+$/.test(rawValue)) {
    throw new Error(`${key} must be an integer between 1 and 65535`);
  }

  const port = Number(rawValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${key} must be an integer between 1 and 65535`);
  }

  return port;
}

export function getServerConfig(env = process.env) {
  const frontendUrl =
    env.FRONTEND_URL?.trim() || "http://localhost:5173";

  let parsedUrl;

  try {
    parsedUrl = new URL(frontendUrl);
  } catch {
    throw new Error("FRONTEND_URL must be a valid HTTP or HTTPS origin");
  }

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    parsedUrl.pathname !== "/" ||
    parsedUrl.search !== "" ||
    parsedUrl.hash !== "" ||
    parsedUrl.username !== "" ||
    parsedUrl.password !== ""
  ) {
    throw new Error("FRONTEND_URL must be a valid HTTP or HTTPS origin");
  }

  return {
    port: readPort(env, "PORT", 5000),
    frontendUrl: parsedUrl.origin,
  };
}

export function getDatabaseConfig(env = process.env) {
  return {
    host: requiredString(env, "DB_HOST"),
    port: readPort(env, "DB_PORT", 3306),
    database: requiredString(env, "DB_NAME"),
    user: requiredString(env, "DB_USER"),
    password: requiredString(env, "DB_PASSWORD"),
  };
}
