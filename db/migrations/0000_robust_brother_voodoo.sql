CREATE SCHEMA "jobs";
--> statement-breakpoint
CREATE TABLE "jobs"."applications" (
	"id" text PRIMARY KEY NOT NULL,
	"company" text NOT NULL,
	"position" text DEFAULT '' NOT NULL,
	"date" text NOT NULL,
	"status" text DEFAULT 'enviada' NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
