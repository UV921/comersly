import { eq } from "drizzle-orm";
import { db } from "..";
import { ingestedItemsTable } from "../schema";

export const getIngestedItemById = async (id: string) => {
  const result = await db
    .select()
    .from(ingestedItemsTable)
    .where(eq(ingestedItemsTable.id, id)).limit(1);
 
  return result[0];
};


import type {
  SourceFormat,
  SourceMetadata,
  SourceRawData,
} from "@/shared/contracts/ingestion";

type CreateIngestedItemsInput = {
  importId: string;
  sourceFormat: SourceFormat;
  rows: Array<{
    rawData: SourceRawData;
    sourceMetadata: SourceMetadata;
  }>;
};

export async function createIngestedItems({
  importId,
  sourceFormat,
  rows,
}: CreateIngestedItemsInput) {
  if (rows.length === 0) {
    return [];
  }

  const values = rows.map((row) => ({
    importId,
    sourceFormat,
    rowKey: row.sourceMetadata.sheetName
      ? `${row.sourceMetadata.sheetName}:${row.sourceMetadata.rowNumber}`
      : `row:${row.sourceMetadata.rowNumber}`,
    rawData: row.rawData,
    sourceMetadata: row.sourceMetadata,
  }));

  return db.insert(ingestedItemsTable).values(values).returning();
}