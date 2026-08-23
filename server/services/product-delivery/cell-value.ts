import type { SourceRawData } from "@/shared/contracts/ingestion";

/*
 * Missing upstream data becomes a blank cell. Values that exist are written
 * through untouched so URLs and descriptions survive round-tripping.
 */
export function toCell(value: string | null | undefined): string {
  return value ?? "";
}

/*
 * Raw spreadsheet cells are untyped JSON. Scalars are preserved verbatim
 * (including upstream placeholders such as "-- Unbranded --", because the raw
 * provenance columns must keep showing exactly what was uploaded). Structured
 * values have no faithful single-cell representation, so they are left blank
 * rather than stringified into something the organizer never sent us.
 */
export function readRawCell(rawData: SourceRawData, column: string): string {
  const value = rawData[column];

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}
