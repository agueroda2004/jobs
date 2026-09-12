import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const jobs = pgSchema("jobs");

export const applications = jobs.table("applications", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull().default(""),
  date: text("date").notNull(),
  status: text("status").notNull().default("enviada"),
  url: text("url").notNull().default(""),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});
