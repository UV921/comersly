import { count, eq } from "drizzle-orm";

import { db } from "@/server/db";
import {
  ingestedItemsTable,
  itemContentTable,
  importsTable,
} from "@/server/db/schema";
import type { ImportStatus } from "@/shared/contracts/ingestion";

export async function markImportProcessing(importId: string) {
  await db
    .update(importsTable)
    .set({
      status: "PROCESSING",
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(importsTable.id, importId));
}

export async function syncImportCompletion(importId: string) {
  const [counts] = await db
    .select({
      total: count(ingestedItemsTable.id),
      ready: count(itemContentTable.id),
    })
    .from(ingestedItemsTable)
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(eq(ingestedItemsTable.importId, importId));

  const total = Number(counts?.total ?? 0);
  const ready = Number(counts?.ready ?? 0);

  let status: ImportStatus = "PROCESSING";

  if (total > 0 && ready >= total) {
    status = "COMPLETED";
  }

  await db
    .update(importsTable)
    .set({
      status,
      successfulRows: ready,
      completedAt: status === "COMPLETED" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(importsTable.id, importId));

  return { total, ready, status };
}
