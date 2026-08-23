import { PRODUCT_DELIVERY_HEADERS } from "./headers";
import type { ProductDeliveryRow } from "./types";
import { createXlsxWorkbook } from "./xlsx-workbook";

export const DELIVERY_WORKSHEET_NAME = "Product Delivery";

/*
 * Serializes the same rows the CSV export uses into a single worksheet.
 *
 * Column order comes from PRODUCT_DELIVERY_HEADERS, so the workbook has exactly
 * the organizer's 252 columns in the organizer's order, with no helper or
 * diagnostic columns.
 */
export function serializeDeliveryXlsx(
  rows: readonly ProductDeliveryRow[],
): Buffer {
  const grid = [
    [...PRODUCT_DELIVERY_HEADERS],
    ...rows.map((row) => PRODUCT_DELIVERY_HEADERS.map((header) => row[header])),
  ];

  return createXlsxWorkbook({
    sheetName: DELIVERY_WORKSHEET_NAME,
    rows: grid,
  });
}
