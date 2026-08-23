import { db } from "@/server/db";
import { importsTable } from "@/server/db/schema";

import type { SourceFormat } from "@/shared/contracts/ingestion";

type CreateImportInput = {
  clerkUserId: string;
  fileName: string;
  sourceFormat: SourceFormat;
  storageKey: string;
  totalRows?: number;
};

export async function createImport({
  clerkUserId,
  fileName,
  sourceFormat,
  storageKey,
  totalRows = 0,
}: CreateImportInput) {
  const [createdImport] = await db
    .insert(importsTable)
    .values({
      clerkUserId,
      fileName,
      sourceFormat,
      storageKey,
      totalRows,
    })
    .returning();

  if (!createdImport) {
    throw new Error("Failed to create import");
  }

  return createdImport;
}
