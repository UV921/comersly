import { eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import {
  ingestedItemsTable,
  itemAssetsTable,
  itemClassificationTable,
  itemContentTable,
  itemNormalizationTable,
} from "@/server/db/schema";
import type { ProductDeliveryInput } from "@/server/services/product-delivery/types";

/*
 * Assembles every persisted stage output an export needs, for all items of one
 * import, in a single round trip.
 *
 * The stage tables are LEFT JOINed on purpose: an item whose pipeline stopped
 * early still belongs in the file, it just carries blank cells for the stages
 * that never ran. That is the whole point of the delivery projection - report
 * what is known, never invent the rest.
 *
 * Rows are ordered by the spreadsheet row number captured at ingestion so the
 * export mirrors the uploaded file, which a uuid or timestamp ordering would
 * not do for a bulk insert.
 */
export async function getProductDeliveryInputsForImport(
  importId: string,
): Promise<ProductDeliveryInput[]> {
  return db
    .select({
      rawData: ingestedItemsTable.rawData,
      manufacturerEvidence: itemClassificationTable.manufacturerEvidence,
      verifiedClassification: itemClassificationTable.verifiedClassification,
      proposedClassification: itemClassificationTable.proposedClassification,
      normalization: itemNormalizationTable.productNormalization,
      content: itemContentTable.productContent,
      assets: itemAssetsTable.productAssets,
    })
    .from(ingestedItemsTable)
    .leftJoin(
      itemClassificationTable,
      eq(itemClassificationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemNormalizationTable,
      eq(itemNormalizationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemAssetsTable,
      eq(itemAssetsTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(eq(ingestedItemsTable.importId, importId))
    .orderBy(
      sql`(${ingestedItemsTable.sourceMetadata} ->> 'rowNumber')::int`,
      ingestedItemsTable.rowKey,
    );
}
