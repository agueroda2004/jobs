import { desc } from "drizzle-orm";
import { applications } from "../db/schema";
import { db } from "../lib/db";
import { withErrors } from "../lib/http";

export const config = { runtime: "edge" };

export default withErrors(async function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const rows = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.date), desc(applications.createdAt));

  return Response.json({ applications: rows.map(toApplication) });
});

function toApplication(row: typeof applications.$inferSelect) {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    date: row.date,
    status: row.status,
    url: row.url,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
