import { cn } from "@/lib/cn";
import type { ImportStatus } from "@/shared/contracts/ingestion";

const IMPORT_STYLES: Record<ImportStatus, string> = {
  PENDING: "bg-surface-muted text-pending",
  PROCESSING: "bg-amber-50 text-processing",
  COMPLETED: "bg-emerald-50 text-completed",
  PARTIALLY_COMPLETED: "bg-teal-50 text-completed",
  FAILED: "bg-red-50 text-failed",
};

const IMPORT_LABELS: Record<ImportStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  PARTIALLY_COMPLETED: "Partially completed",
  FAILED: "Failed",
};

export function ImportStatusBadge({ status }: { status: ImportStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        IMPORT_STYLES[status],
      )}
    >
      {IMPORT_LABELS[status]}
    </span>
  );
}

export function NeedsReviewBadge() {
  return (
    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-review">
      Needs review
    </span>
  );
}

export function ProductStateBadge({
  isReady,
}: {
  isReady: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        isReady ? "bg-emerald-50 text-completed" : "bg-amber-50 text-processing",
      )}
    >
      {isReady ? "Ready" : "Processing"}
    </span>
  );
}

export function ConfidenceBadge({
  confidence,
}: {
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
}) {
  if (!confidence) {
    return <span className="text-muted">—</span>;
  }

  const styles = {
    HIGH: "bg-emerald-50 text-completed",
    MEDIUM: "bg-amber-50 text-processing",
    LOW: "bg-surface-muted text-pending",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        styles[confidence],
      )}
    >
      {confidence.charAt(0) + confidence.slice(1).toLowerCase()}
    </span>
  );
}
