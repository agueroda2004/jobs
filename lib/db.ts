import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon connection string to the environment.",
  );
}

export const db = drizzle(neon(connectionString), { schema });
