import { db } from "@/server/db";
import { itemNormalizationTable } from "@/server/db/schema";

import type { ProductNormalization } from "@/server/services/product-normalization/schema";

type SaveItemNormalizationInput = {
  ingestedItemId: string;
  productNormalization: ProductNormalization;
};

export async function saveItemNormalization({
  ingestedItemId,
  productNormalization,
}: SaveItemNormalizationInput) {
  const [savedNormalization] = await db
    .insert(itemNormalizationTable)
    .values({
      ingestedItemId,
      productNormalization,
    })
    .onConflictDoUpdate({
      target: itemNormalizationTable.ingestedItemId,
      set: {
        productNormalization,
        updatedAt: new Date(),
      },
    })
    .returning();

  return savedNormalization;
}