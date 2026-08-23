import { db } from "@/server/db";
import { importsTable } from "@/server/db/schema";

import type { SourceFormat } from "@/shared/contracts/ingestion";

type CreateImportInput = {
  clerkUserId: string;
  fileName: string;
  sourceFormat: SourceFormat;
  storageKey: string;
};

export async function createImport({
  clerkUserId,
  fileName,
  sourceFormat,
  storageKey,
}: CreateImportInput) {
  const [createdImport] = await db
    .insert(importsTable)
    .values({
      clerkUserId,
      fileName,
      sourceFormat,
      storageKey,
    })
    .returning();

  return createdImport;
}