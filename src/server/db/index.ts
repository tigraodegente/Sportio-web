import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Enable proxy support for environments with HTTPS_PROXY (e.g. containers)
const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
if (httpsProxy && typeof globalThis.process !== "undefined") {
  try {
    const { ProxyAgent, fetch: proxyFetch } = require("undici");
    const agent = new ProxyAgent(httpsProxy);
    neonConfig.fetchFunction = ((url: any, init: any) =>
      proxyFetch(url, { ...init, dispatcher: agent })) as any;
  } catch {
    // undici not available, fall back to default fetch
  }
}

const connectionString = process.env.DATABASE_URL ?? "postgresql://noop:noop@noop.neon.tech/noop";
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export type DB = NeonHttpDatabase<typeof schema>;
