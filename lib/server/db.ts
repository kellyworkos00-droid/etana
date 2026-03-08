import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

declare global {
  var __eternaPgPool: Pool | undefined;
}

export const dbPool = connectionString
  ? global.__eternaPgPool ??
    new Pool({
      connectionString,
      max: 5,
      ssl: { rejectUnauthorized: false },
    })
  : null;

if (dbPool && process.env.NODE_ENV !== "production") {
  global.__eternaPgPool = dbPool;
}
