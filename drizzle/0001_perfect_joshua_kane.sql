CREATE TABLE "item_interpretations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingested_item_id" uuid NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_interpretations" ADD CONSTRAINT "item_interpretations_ingested_item_id_ingested_items_id_fk" FOREIGN KEY ("ingested_item_id") REFERENCES "public"."ingested_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_import_id_unique" UNIQUE("import_id");