import { db } from "@/server/db";
import { itemEnrichmentTable } from "@/server/db/schema";

import type { ProductEnrichment } from "@/server/services/product-enrichment/schema";

type SaveItemEnrichmentInput = {
  ingestedItemId: string;
  productEnrichment: ProductEnrichment;
};

export async function saveItemEnrichment({
  ingestedItemId,
  productEnrichment,
}: SaveItemEnrichmentInput) {
  const [savedEnrichment] = await db
    .insert(itemEnrichmentTable)
    .values({
      ingestedItemId,
      productEnrichment,
    })
    .onConflictDoUpdate({
      target: itemEnrichmentTable.ingestedItemId,

      set: {
        productEnrichment,
        updatedAt: new Date(),
      },
    })
    .returning();

  return savedEnrichment;
}