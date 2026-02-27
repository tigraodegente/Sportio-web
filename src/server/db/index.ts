import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb(): NeonHttpDatabase<typeof schema> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

let _db: NeonHttpDatabase<typeof schema> | undefined;

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    if (!_db) {
      _db = createDb();
    }
    return Reflect.get(_db, prop);
  },
});

export type DB = NeonHttpDatabase<typeof schema>;
