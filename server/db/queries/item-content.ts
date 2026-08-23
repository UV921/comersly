import { db } from "@/server/db";
import { itemContentTable } from "@/server/db/schema";

import type { ProductContent } from "@/server/services/product-content/schema";

type SaveItemContentInput = {
  ingestedItemId: string;
  productContent: ProductContent;
};

export async function saveItemContent({
  ingestedItemId,
  productContent,
}: SaveItemContentInput) {
  const [savedContent] = await db
    .insert(itemContentTable)
    .values({
      ingestedItemId,
      productContent,
    })
    .onConflictDoUpdate({
      target: itemContentTable.ingestedItemId,
      set: {
        productContent,
        updatedAt: new Date(),
      },
    })
    .returning();

  return savedContent;
}