CREATE TABLE "item_normalization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingested_item_id" uuid NOT NULL,
	"product_normalization" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_normalization_ingested_item_id_unique" UNIQUE("ingested_item_id")
);
--> statement-breakpoint
ALTER TABLE "item_normalization" ADD CONSTRAINT "item_normalization_ingested_item_id_ingested_items_id_fk" FOREIGN KEY ("ingested_item_id") REFERENCES "public"."ingested_items"("id") ON DELETE cascade ON UPDATE no action;