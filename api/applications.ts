import { desc, eq } from "drizzle-orm";
import { applications } from "../db/schema";
import { db } from "../lib/db";
import { withErrors } from "../lib/http";

export const config = { runtime: "edge" };

const VALID_STATUSES = new Set([
  "enviada",
  "en_revision",
  "entrevista",
  "oferta",
  "rechazada",
]);

type ApplicationInput = {
  id?: unknown;
  company?: unknown;
  position?: unknown;
  date?: unknown;
  status?: unknown;
  url?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export default withErrors(async function handler(req: Request) {
  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.date), desc(applications.createdAt));
    return Response.json(rows.map(toApplication));
  }

  const body = (await req.json().catch(() => null)) as ApplicationInput | null;

  if (req.method === "POST") {
    const input = validateCreate(body);
    if (input instanceof Response) return input;

    const row = await db.insert(applications).values(input).returning();
    return Response.json(toApplication(row[0]), { status: 201 });
  }

  if (req.method === "PATCH") {
    const input = validateUpdate(body);
    if (input instanceof Response) return input;

    const row = await db
      .update(applications)
      .set({ ...input.data, updatedAt: new Date().toISOString() })
      .where(eq(applications.id, input.id))
      .returning();

    if (!row[0]) return Response.json({ error: "Application not found" }, { status: 404 });
    return Response.json(toApplication(row[0]));
  }

  if (req.method === "DELETE") {
    if (typeof body?.id !== "string" || !body.id) {
      return Response.json({ error: "A valid application id is required" }, { status: 400 });
    }

    const row = await db
      .delete(applications)
      .where(eq(applications.id, body.id))
      .returning({ id: applications.id });

    if (!row[0]) return Response.json({ error: "Application not found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
});

function validateCreate(body: ApplicationInput | null) {
  if (
    !body ||
    typeof body.id !== "string" ||
    typeof body.company !== "string" ||
    typeof body.position !== "string" ||
    typeof body.date !== "string" ||
    typeof body.status !== "string" ||
    typeof body.url !== "string" ||
    typeof body.createdAt !== "string" ||
    typeof body.updatedAt !== "string"
  ) {
    return Response.json({ error: "Invalid application payload" }, { status: 400 });
  }

  if (!body.id || !body.company.trim() || !body.position.trim() || !body.date) {
    return Response.json(
      { error: "Company, position, date, and id are required" },
      { status: 400 },
    );
  }

  if (!VALID_STATUSES.has(body.status)) {
    return Response.json({ error: "Invalid application status" }, { status: 400 });
  }

  return {
    id: body.id,
    company: body.company.trim(),
    position: body.position.trim(),
    date: body.date,
    status: body.status,
    url: body.url.trim(),
    createdAt: body.createdAt,
    updatedAt: body.updatedAt,
  };
}

function validateUpdate(body: ApplicationInput | null) {
  if (!body || typeof body.id !== "string" || !body.id) {
    return Response.json({ error: "A valid application id is required" }, { status: 400 });
  }

  const data: Partial<typeof applications.$inferInsert> = {};
  if (body.company !== undefined) {
    if (typeof body.company !== "string" || !body.company.trim()) {
      return Response.json({ error: "Company must be a non-empty string" }, { status: 400 });
    }
    data.company = body.company.trim();
  }
  if (body.position !== undefined) {
    if (typeof body.position !== "string") {
      return Response.json({ error: "Position must be a string" }, { status: 400 });
    }
    data.position = body.position.trim();
  }
  if (body.date !== undefined) {
    if (typeof body.date !== "string" || !body.date) {
      return Response.json({ error: "Date must be a non-empty string" }, { status: 400 });
    }
    data.date = body.date;
  }
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !VALID_STATUSES.has(body.status)) {
      return Response.json({ error: "Invalid application status" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.url !== undefined) {
    if (typeof body.url !== "string") {
      return Response.json({ error: "URL must be a string" }, { status: 400 });
    }
    data.url = body.url.trim();
  }

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "No fields to update" }, { status: 400 });
  }

  return { id: body.id, data };
}

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
