import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(connectionString);
export const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema });

export type DB = NeonHttpDatabase<typeof schema>;
