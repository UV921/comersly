import { db } from "@/server/db";
import { itemAssetsTable } from "@/server/db/schema";

import type { ProductAssets } from "@/server/services/product-assets/schema";

type SaveItemAssetsInput = {
  ingestedItemId: string;
  productAssets: ProductAssets;
};

export async function saveItemAssets({
  ingestedItemId,
  productAssets,
}: SaveItemAssetsInput) {
  const [savedAssets] = await db
    .insert(itemAssetsTable)
    .values({
      ingestedItemId,
      productAssets,
    })
    .onConflictDoUpdate({
      target: itemAssetsTable.ingestedItemId,

      set: {
        productAssets,
        updatedAt: new Date(),
      },
    })
    .returning();

  return savedAssets;
}