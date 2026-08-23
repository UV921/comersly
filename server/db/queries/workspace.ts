import { and, count, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import {
  ingestedItemsTable,
  importsTable,
  itemAssetsTable,
  itemClassificationTable,
  itemContentTable,
  itemEnrichmentTable,
  itemInterpretation,
  itemNormalizationTable,
} from "@/server/db/schema";
import { ownedImportFilter } from "@/server/db/queries/imports";
import { isImportExportable } from "@/server/services/product-delivery/export-readiness";
import type { ProductAssets } from "@/server/services/product-assets/schema";
import type { ProductContent } from "@/server/services/product-content/schema";
import type { InterpretedItem } from "@/server/services/product-interpretation/schema";
import type { ManufacturerClassificationEvidence } from "@/server/services/product-classification/manufacturer-evidence";
import type {
  ProductClassification,
  ProposedClassification,
} from "@/server/services/product-classification/schema";
import type { ProductNormalization } from "@/server/services/product-normalization/schema";
import type { ImportStatus, SourceRawData } from "@/shared/contracts/ingestion";
import {
  formatClassificationPath,
  readRawText,
} from "@/lib/product-display";

export type ImportListItem = {
  id: string;
  fileName: string;
  sourceFormat: "CSV" | "XLSX";
  status: ImportStatus;
  totalRows: number;
  successfulRows: number;
  readyCount: number;
  createdAt: Date;
  exportable: boolean;
};

export type DashboardMetrics = {
  totalImports: number;
  productsProcessed: number;
  processingImports: number;
  needsReview: number;
  completedImports: number;
};

export type PipelineCounts = {
  total: number;
  interpreted: number;
  classified: number;
  assets: number;
  enriched: number;
  normalized: number;
  content: number;
};

export type ProductRow = {
  id: string;
  importId: string;
  importFileName: string;
  rowNumber: number;
  rawMpn: string | null;
  rawDescription: string | null;
  brand: string | null;
  manufacturer: string | null;
  productType: string | null;
  productName: string | null;
  proposedClasspath: string | null;
  verifiedClasspath: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  needsReview: boolean;
  isReady: boolean;
};

export type ProductIntelligence = {
  id: string;
  importId: string;
  importFileName: string;
  rowNumber: number;
  sheetName: string | null;
  rawData: SourceRawData;
  rawMpn: string | null;
  rawDescription: string | null;
  rawManufacturerLabel: string | null;
  interpretation: InterpretedItem | null;
  manufacturerEvidence: ManufacturerClassificationEvidence | null;
  verifiedClassification: ProductClassification | null;
  proposedClassification: ProposedClassification | null;
  normalization: ProductNormalization | null;
  content: ProductContent | null;
  assets: ProductAssets | null;
  hasInterpretation: boolean;
  hasClassification: boolean;
  hasAssets: boolean;
  hasEnrichment: boolean;
  hasNormalization: boolean;
  hasContent: boolean;
};

function toProductRow(row: {
  id: string;
  importId: string;
  importFileName: string;
  sourceMetadata: { rowNumber?: number } | null;
  rawData: SourceRawData;
  manufacturerEvidence: ManufacturerClassificationEvidence | null;
  verifiedClassification: ProductClassification | null;
  proposedClassification: ProposedClassification | null;
  hasContent: boolean;
}): ProductRow {
  const evidence = row.manufacturerEvidence;
  const proposed = row.proposedClassification;
  const verified = row.verifiedClassification;

  return {
    id: row.id,
    importId: row.importId,
    importFileName: row.importFileName,
    rowNumber: row.sourceMetadata?.rowNumber ?? 0,
    rawMpn: readRawText(row.rawData, "Mfg_Part_Num"),
    rawDescription: readRawText(row.rawData, "Part_Desc"),
    brand: evidence?.brandName ?? null,
    manufacturer: evidence?.manufacturerName ?? null,
    productType: evidence?.productType ?? null,
    productName: evidence?.productName ?? null,
    proposedClasspath: formatClassificationPath(proposed),
    verifiedClasspath: formatClassificationPath(verified),
    confidence: proposed?.confidence ?? verified?.confidence ?? null,
    needsReview: Boolean(proposed?.needsReview || verified?.needsReview),
    isReady: row.hasContent,
  };
}

export async function getDashboardMetrics(
  clerkUserId: string,
): Promise<DashboardMetrics> {
  const [importCounts] = await db
    .select({
      totalImports: count(),
      processingImports: sql<number>`count(*) filter (where ${importsTable.status} in ('PENDING', 'PROCESSING'))`,
      completedImports: sql<number>`count(*) filter (where ${importsTable.status} in ('COMPLETED', 'PARTIALLY_COMPLETED'))`,
    })
    .from(importsTable)
    .where(eq(importsTable.clerkUserId, clerkUserId));

  const [productCounts] = await db
    .select({
      productsProcessed: count(itemContentTable.id),
      needsReview: sql<number>`count(*) filter (where coalesce((${itemClassificationTable.proposedClassification} ->> 'needsReview')::boolean, false) or coalesce((${itemClassificationTable.verifiedClassification} ->> 'needsReview')::boolean, false))`,
    })
    .from(ingestedItemsTable)
    .innerJoin(
      importsTable,
      eq(importsTable.id, ingestedItemsTable.importId),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemClassificationTable,
      eq(itemClassificationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(eq(importsTable.clerkUserId, clerkUserId));

  return {
    totalImports: Number(importCounts?.totalImports ?? 0),
    processingImports: Number(importCounts?.processingImports ?? 0),
    completedImports: Number(importCounts?.completedImports ?? 0),
    productsProcessed: Number(productCounts?.productsProcessed ?? 0),
    needsReview: Number(productCounts?.needsReview ?? 0),
  };
}

export async function listImportsForWorkspace(
  clerkUserId: string,
): Promise<ImportListItem[]> {
  const rows = await db
    .select({
      id: importsTable.id,
      fileName: importsTable.fileName,
      sourceFormat: importsTable.sourceFormat,
      status: importsTable.status,
      totalRows: importsTable.totalRows,
      successfulRows: importsTable.successfulRows,
      createdAt: importsTable.createdAt,
      readyCount: sql<number>`count(${itemContentTable.id})`,
    })
    .from(importsTable)
    .leftJoin(
      ingestedItemsTable,
      eq(ingestedItemsTable.importId, importsTable.id),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(eq(importsTable.clerkUserId, clerkUserId))
    .groupBy(importsTable.id)
    .orderBy(desc(importsTable.createdAt));

  return rows.map((row) => ({
    id: row.id,
    fileName: row.fileName,
    sourceFormat: row.sourceFormat,
    status: row.status,
    totalRows: row.totalRows,
    successfulRows: row.successfulRows,
    readyCount: Number(row.readyCount ?? 0),
    createdAt: row.createdAt,
    exportable: isImportExportable(row.status),
  }));
}

export async function getImportPipelineCounts(
  importId: string,
): Promise<PipelineCounts> {
  const [row] = await db
    .select({
      total: count(ingestedItemsTable.id),
      interpreted: count(itemInterpretation.id),
      classified: count(itemClassificationTable.id),
      assets: count(itemAssetsTable.id),
      enriched: count(itemEnrichmentTable.id),
      normalized: count(itemNormalizationTable.id),
      content: count(itemContentTable.id),
    })
    .from(ingestedItemsTable)
    .leftJoin(
      itemInterpretation,
      eq(itemInterpretation.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemClassificationTable,
      eq(itemClassificationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemAssetsTable,
      eq(itemAssetsTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemEnrichmentTable,
      eq(itemEnrichmentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemNormalizationTable,
      eq(itemNormalizationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(eq(ingestedItemsTable.importId, importId));

  return {
    total: Number(row?.total ?? 0),
    interpreted: Number(row?.interpreted ?? 0),
    classified: Number(row?.classified ?? 0),
    assets: Number(row?.assets ?? 0),
    enriched: Number(row?.enriched ?? 0),
    normalized: Number(row?.normalized ?? 0),
    content: Number(row?.content ?? 0),
  };
}

export async function listImportProductsForUser(
  importId: string,
  clerkUserId: string,
): Promise<ProductRow[]> {
  const rows = await db
    .select({
      id: ingestedItemsTable.id,
      importId: ingestedItemsTable.importId,
      importFileName: importsTable.fileName,
      sourceMetadata: ingestedItemsTable.sourceMetadata,
      rawData: ingestedItemsTable.rawData,
      manufacturerEvidence: itemClassificationTable.manufacturerEvidence,
      verifiedClassification: itemClassificationTable.verifiedClassification,
      proposedClassification: itemClassificationTable.proposedClassification,
      contentId: itemContentTable.id,
    })
    .from(ingestedItemsTable)
    .innerJoin(
      importsTable,
      eq(importsTable.id, ingestedItemsTable.importId),
    )
    .leftJoin(
      itemClassificationTable,
      eq(itemClassificationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(ownedImportFilter(importId, clerkUserId))
    .orderBy(
      sql`(${ingestedItemsTable.sourceMetadata} ->> 'rowNumber')::int`,
      ingestedItemsTable.rowKey,
    );

  return rows.map((row) =>
    toProductRow({
      ...row,
      hasContent: Boolean(row.contentId),
    }),
  );
}

export async function listProductsForUser(
  clerkUserId: string,
): Promise<ProductRow[]> {
  const rows = await db
    .select({
      id: ingestedItemsTable.id,
      importId: ingestedItemsTable.importId,
      importFileName: importsTable.fileName,
      sourceMetadata: ingestedItemsTable.sourceMetadata,
      rawData: ingestedItemsTable.rawData,
      manufacturerEvidence: itemClassificationTable.manufacturerEvidence,
      verifiedClassification: itemClassificationTable.verifiedClassification,
      proposedClassification: itemClassificationTable.proposedClassification,
      contentId: itemContentTable.id,
    })
    .from(ingestedItemsTable)
    .innerJoin(
      importsTable,
      eq(importsTable.id, ingestedItemsTable.importId),
    )
    .leftJoin(
      itemClassificationTable,
      eq(itemClassificationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(eq(importsTable.clerkUserId, clerkUserId))
    .orderBy(desc(ingestedItemsTable.createdAt));

  return rows.map((row) =>
    toProductRow({
      ...row,
      hasContent: Boolean(row.contentId),
    }),
  );
}

export async function getProductIntelligenceForUser(
  itemId: string,
  clerkUserId: string,
): Promise<ProductIntelligence | null> {
  const [row] = await db
    .select({
      id: ingestedItemsTable.id,
      importId: ingestedItemsTable.importId,
      importFileName: importsTable.fileName,
      sourceMetadata: ingestedItemsTable.sourceMetadata,
      rawData: ingestedItemsTable.rawData,
      interpretation: itemInterpretation.result,
      manufacturerEvidence: itemClassificationTable.manufacturerEvidence,
      verifiedClassification: itemClassificationTable.verifiedClassification,
      proposedClassification: itemClassificationTable.proposedClassification,
      normalization: itemNormalizationTable.productNormalization,
      content: itemContentTable.productContent,
      assets: itemAssetsTable.productAssets,
      interpretationId: itemInterpretation.id,
      classificationId: itemClassificationTable.id,
      assetsId: itemAssetsTable.id,
      enrichmentId: itemEnrichmentTable.id,
      normalizationId: itemNormalizationTable.id,
      contentId: itemContentTable.id,
    })
    .from(ingestedItemsTable)
    .innerJoin(
      importsTable,
      eq(importsTable.id, ingestedItemsTable.importId),
    )
    .leftJoin(
      itemInterpretation,
      eq(itemInterpretation.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemClassificationTable,
      eq(itemClassificationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemAssetsTable,
      eq(itemAssetsTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemEnrichmentTable,
      eq(itemEnrichmentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemNormalizationTable,
      eq(itemNormalizationTable.ingestedItemId, ingestedItemsTable.id),
    )
    .leftJoin(
      itemContentTable,
      eq(itemContentTable.ingestedItemId, ingestedItemsTable.id),
    )
    .where(
      and(
        eq(ingestedItemsTable.id, itemId),
        eq(importsTable.clerkUserId, clerkUserId),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    importId: row.importId,
    importFileName: row.importFileName,
    rowNumber: row.sourceMetadata.rowNumber,
    sheetName: row.sourceMetadata.sheetName,
    rawData: row.rawData,
    rawMpn: readRawText(row.rawData, "Mfg_Part_Num"),
    rawDescription: readRawText(row.rawData, "Part_Desc"),
    rawManufacturerLabel: readRawText(row.rawData, "Part_Manuf"),
    interpretation: row.interpretation ?? null,
    manufacturerEvidence: row.manufacturerEvidence ?? null,
    verifiedClassification: row.verifiedClassification ?? null,
    proposedClassification: row.proposedClassification ?? null,
    normalization: row.normalization ?? null,
    content: row.content ?? null,
    assets: row.assets ?? null,
    hasInterpretation: Boolean(row.interpretationId),
    hasClassification: Boolean(row.classificationId),
    hasAssets: Boolean(row.assetsId),
    hasEnrichment: Boolean(row.enrichmentId),
    hasNormalization: Boolean(row.normalizationId),
    hasContent: Boolean(row.contentId),
  };
}
