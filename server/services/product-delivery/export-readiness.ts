import type { ImportStatus } from "@/shared/contracts/ingestion";

/*
 * Completion policy for the delivery export.
 *
 * An import is exportable once processing has finished, whether every row
 * succeeded (COMPLETED) or only some did (PARTIALLY_COMPLETED). Exporting a
 * PENDING, PROCESSING or FAILED import is refused instead of silently handing
 * over a file of mostly blank rows that looks like a finished deliverable.
 *
 * For a PARTIALLY_COMPLETED import every successfully ingested item is still
 * exported; rows that failed ingestion never became items and are recorded in
 * ingestion_errors rather than being padded into the file.
 */
export const EXPORTABLE_IMPORT_STATUSES = [
  "COMPLETED",
  "PARTIALLY_COMPLETED",
] as const satisfies readonly ImportStatus[];

export function isImportExportable(status: ImportStatus): boolean {
  return EXPORTABLE_IMPORT_STATUSES.some(
    (exportable) => exportable === status,
  );
}

export function canDownloadDelivery(input: {
  status: ImportStatus;
  readyCount: number;
  totalCount: number;
}): boolean {
  if (isImportExportable(input.status)) {
    return true;
  }

  return input.totalCount > 0 && input.readyCount >= input.totalCount;
}
