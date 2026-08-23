import { db } from "@/server/db";

import { itemClassificationTable } from "@/server/db/schema";

import type { ClassificationResult } from "@/server/services/product-classification/classification-result";

type SaveItemClassificationInput = {
  ingestedItemId: string;
  classificationResult: ClassificationResult;
};

export async function saveItemClassification({
  ingestedItemId,
  classificationResult,
}: SaveItemClassificationInput) {
  const {
    manufacturerEvidence,
    verifiedClassification,
    proposedClassification,
  } = classificationResult;

  const [savedClassification] = await db
    .insert(itemClassificationTable)
    .values({
      ingestedItemId,
      manufacturerEvidence,
      verifiedClassification,
      proposedClassification,
    })
    .onConflictDoUpdate({
      target: itemClassificationTable.ingestedItemId,

      set: {
        manufacturerEvidence,
        verifiedClassification,
        proposedClassification,
        updatedAt: new Date(),
      },
    })
    .returning();

  return savedClassification;
}