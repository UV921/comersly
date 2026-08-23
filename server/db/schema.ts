import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  SourceRawData,
  SourceMetadata,
  JsonValue,
} from "@/shared/contracts/ingestion";
import {
  sourceFormat,
  sourceType,
  importStatus,
} from "@/shared/contracts/ingestion";
import { InterpretedItem } from "../services/product-interpretation/schema";
import type { ProductAssets } from "@/server/services/product-assets/schema";

export const sourceFormatEnum = pgEnum("source_format", sourceFormat);

export const sourceTypeEnum = pgEnum("source_type", sourceType);

export const importStatusEnum = pgEnum("import_status", importStatus);

/*
 * One record represents one uploaded CSV or XLSX file.
 */

export const importsTable = pgTable(
  "imports",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clerkUserId: text("clerk_user_id").notNull(),

    fileName: text("file_name").notNull(),

    sourceFormat: sourceFormatEnum("source_format").notNull(),

    storageKey: text("storage_key").notNull().unique(),

    status: importStatusEnum("status").default("PENDING").notNull(),

    totalRows: integer("total_rows").default(0).notNull(),

    successfulRows: integer("successful_rows").default(0).notNull(),

    malformedRows: integer("malformed_rows").default(0).notNull(),

    failureMessage: text("failure_message"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    startedAt: timestamp("started_at", {
      withTimezone: true,
      mode: "date",
    }),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
      mode: "date",
    }),
  },
  (table) => [
    index("imports_clerk_user_created_at_idx").on(
      table.clerkUserId,
      table.createdAt,
    ),
  ],
);

/*
 * One record represents one valid non-empty spreadsheet row.
 */

export const ingestedItemsTable = pgTable(
  "ingested_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    importId: uuid("import_id")
      .notNull()
      .references(() => importsTable.id, {
        onDelete: "cascade",
      }),

    sourceType: sourceTypeEnum("source_type")
      .default("SPREADSHEET_ROW")
      .notNull(),

    sourceFormat: sourceFormatEnum("source_format").notNull(),

    rowKey: text("row_key").notNull(),

    rawData: jsonb("raw_data").$type<SourceRawData>().notNull(),

    sourceMetadata: jsonb("source_metadata").$type<SourceMetadata>().notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("ingested_items_import_row_unique").on(table.importId, table.rowKey),
  ],
);

/*
 * One record represents one malformed spreadsheet row.
 */

export const ingestionErrorsTable = pgTable(
  "ingestion_errors",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    importId: uuid("import_id")
      .notNull()
      .references(() => importsTable.id, {
        onDelete: "cascade",
      }).unique(),

    rowKey: text("row_key").notNull(),

    rawRow: jsonb("raw_row").$type<JsonValue>().notNull(),

    sourceMetadata: jsonb("source_metadata").$type<SourceMetadata>().notNull(),

    errorMessage: text("error_message").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("ingestion_errors_import_row_unique").on(
      table.importId,
      table.rowKey,
    ),
  ],
);

export const itemInterpretation = pgTable("item_interpretations", {
  id: uuid("id").defaultRandom().primaryKey(),
  ingestedItemId: uuid("ingested_item_id")
    .references(() => ingestedItemsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  result: jsonb("result").$type<InterpretedItem>().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});


import type { ManufacturerClassificationEvidence } from "@/server/services/product-classification/manufacturer-evidence";
import type { ProductClassification } from "@/server/services/product-classification/schema";
import type { ProposedClassification } from "@/server/services/product-classification/schema";

export const itemClassificationTable = pgTable(
  "item_classification",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    ingestedItemId: uuid("ingested_item_id")
      .notNull()
      .references(() => ingestedItemsTable.id, {
        onDelete: "cascade",
      })
      .unique(),

    manufacturerEvidence: jsonb("manufacturer_evidence")
      .$type<ManufacturerClassificationEvidence>(),

    verifiedClassification: jsonb("verified_classification")
      .$type<ProductClassification>()
      .notNull(),

    proposedClassification: jsonb("proposed_classification")
      .$type<ProposedClassification>()
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
);

export const itemAssetsTable = pgTable(
  "item_assets",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    ingestedItemId: uuid("ingested_item_id")
      .notNull()
      .references(() => ingestedItemsTable.id, {
        onDelete: "cascade",
      })
      .unique(),

    productAssets: jsonb("product_assets")
      .$type<ProductAssets>()
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
);