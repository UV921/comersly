import { canDownloadDelivery } from "@/server/services/product-delivery/export-readiness";
import type { ImportStatus } from "@/shared/contracts/ingestion";

export function ExportActions({
  importId,
  status,
  readyCount,
  totalCount,
}: {
  importId: string;
  status: ImportStatus;
  readyCount: number;
  totalCount: number;
}) {
  const ready = canDownloadDelivery({
    status,
    readyCount,
    totalCount,
  });

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
        className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
      >
        Download CSV
      </a>
      <a
        href={`/api/imports/${importId}/delivery?format=xlsx`}
        className="inline-flex h-10 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-muted"
      >
        Download XLSX
      </a>
      <p className="text-xs text-muted">
        Exports follow the required 252-column delivery format.
      </p>
    </div>
  );
}
