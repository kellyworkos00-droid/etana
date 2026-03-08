import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const createPool = (url: string) =>
  new Pool({
    connectionString: url,
    max: 5,
    ssl: { rejectUnauthorized: false },
  });

type PgPool = ReturnType<typeof createPool>;

declare global {
  var __eternaPgPool: PgPool | undefined;
}

export const dbPool: PgPool | null = connectionString ? global.__eternaPgPool ?? createPool(connectionString) : null;

if (dbPool && process.env.NODE_ENV !== "production") {
  global.__eternaPgPool = dbPool;
}
