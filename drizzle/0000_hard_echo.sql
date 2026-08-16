CREATE TYPE "public"."import_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."source_format" AS ENUM('CSV', 'XLSX');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('SPREADSHEET_ROW');--> statement-breakpoint
CREATE TABLE "imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"file_name" text NOT NULL,
	"source_format" "source_format" NOT NULL,
	"storage_key" text NOT NULL,
	"status" "import_status" DEFAULT 'PENDING' NOT NULL,
	"total_rows" integer DEFAULT 0 NOT NULL,
	"successful_rows" integer DEFAULT 0 NOT NULL,
	"malformed_rows" integer DEFAULT 0 NOT NULL,
	"failure_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	CONSTRAINT "imports_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "ingested_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_id" uuid NOT NULL,
	"source_type" "source_type" DEFAULT 'SPREADSHEET_ROW' NOT NULL,
	"source_format" "source_format" NOT NULL,
	"row_key" text NOT NULL,
	"raw_data" jsonb NOT NULL,
	"source_metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ingested_items_import_row_unique" UNIQUE("import_id","row_key")
);
--> statement-breakpoint
CREATE TABLE "ingestion_errors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_id" uuid NOT NULL,
	"row_key" text NOT NULL,
	"raw_row" jsonb NOT NULL,
	"source_metadata" jsonb NOT NULL,
	"error_message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ingestion_errors_import_row_unique" UNIQUE("import_id","row_key")
);
--> statement-breakpoint
ALTER TABLE "ingested_items" ADD CONSTRAINT "ingested_items_import_id_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."imports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_import_id_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."imports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "imports_clerk_user_created_at_idx" ON "imports" USING btree ("clerk_user_id","created_at");