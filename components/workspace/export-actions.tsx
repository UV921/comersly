import { isImportExportable } from "@/server/services/product-delivery/export-readiness";
import type { ImportStatus } from "@/shared/contracts/ingestion";

export function ExportActions({
  importId,
  status,
}: {
  importId: string;
  status: ImportStatus;
}) {
  const ready = isImportExportable(status);

  if (!ready) {
    return (
      <p className="text-sm text-muted">
        Downloads become available when processing has finished.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`/api/imports/${importId}/delivery?format=csv`}
        className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-ink-fg hover:opacity-90"
      >
        Download CSV
      </a>
      <a
        href={`/api/imports/${importId}/delivery?format=xlsx`}
        className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-muted"
      >
        Download XLSX
      </a>
      <p className="text-xs text-muted">
        Exports follow the required 252-column delivery format.
      </p>
    </div>
  );
}
