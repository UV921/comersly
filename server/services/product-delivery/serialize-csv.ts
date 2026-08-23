import { PRODUCT_DELIVERY_HEADERS } from "./headers";
import type { ProductDeliveryRow } from "./types";

const ROW_SEPARATOR = "\r\n";

const NEEDS_QUOTING = /[",\r\n]/;

/*
 * RFC 4180 field encoding: a field is quoted only when it contains a comma, a
 * double quote or a line break, and embedded double quotes are doubled.
 */
function encodeCsvField(value: string): string {
  if (!NEEDS_QUOTING.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}

function encodeCsvRow(cells: readonly string[]): string {
  return cells.map(encodeCsvField).join(",");
}

/*
 * Serializes delivery rows in the organizer's column order.
 *
 * Column order comes from PRODUCT_DELIVERY_HEADERS, never from iterating row
 * object keys, so a row built in any order still serializes identically.
 *
 * No UTF-8 BOM is written: the organizer's own template has no BOM, and adding
 * one would put three bytes in front of the first header name for any consumer
 * doing a byte or string comparison. XLSX is the Excel-friendly download.
 * Line breaks are CRLF, matching both RFC 4180 and the organizer's template.
 */
export function serializeDeliveryCsv(
  rows: readonly ProductDeliveryRow[],
): string {
  const lines = [encodeCsvRow(PRODUCT_DELIVERY_HEADERS)];

  for (const row of rows) {
    lines.push(encodeCsvRow(PRODUCT_DELIVERY_HEADERS.map((header) => row[header])));
  }

  return `${lines.join(ROW_SEPARATOR)}${ROW_SEPARATOR}`;
}
