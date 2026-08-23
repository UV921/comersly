CREATE TABLE "item_classification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingested_item_id" uuid NOT NULL,
	"manufacturer_evidence" jsonb,
	"verified_classification" jsonb NOT NULL,
	"proposed_classification" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_classification_ingested_item_id_unique" UNIQUE("ingested_item_id")
);
--> statement-breakpoint
ALTER TABLE "item_classification" ADD CONSTRAINT "item_classification_ingested_item_id_ingested_items_id_fk" FOREIGN KEY ("ingested_item_id") REFERENCES "public"."ingested_items"("id") ON DELETE cascade ON UPDATE no action;