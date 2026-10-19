import mysql from "mysql2/promise";
import { getDatabaseConfig } from "../config.js";

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...getDatabaseConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

const databasePool = {
  query(...args) {
    return getPool().query(...args);
  },
};

export default databasePool;
