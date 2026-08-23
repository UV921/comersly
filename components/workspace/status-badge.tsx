import { cn } from "@/lib/cn";
import type { ImportStatus } from "@/shared/contracts/ingestion";

const IMPORT_STYLES: Record<ImportStatus, string> = {
  PENDING: "bg-[var(--badge-neutral-bg)] text-pending",
  PROCESSING: "bg-[var(--badge-warning-bg)] text-processing",
  COMPLETED: "bg-[var(--badge-success-bg)] text-completed",
  PARTIALLY_COMPLETED: "bg-[var(--badge-success-bg)] text-completed",
  FAILED: "bg-[var(--badge-danger-bg)] text-failed",
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
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        IMPORT_STYLES[status],
      )}
    >
      {IMPORT_LABELS[status]}
    </span>
  );
}

export function NeedsReviewBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--badge-warning-bg)] px-2 py-0.5 text-xs font-medium text-review">
      Needs review
    </span>
  );
}

export function ProductStateBadge({ isReady }: { isReady: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isReady
          ? "bg-[var(--badge-success-bg)] text-completed"
          : "bg-[var(--badge-warning-bg)] text-processing",
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
    HIGH: "bg-[var(--badge-success-bg)] text-completed",
    MEDIUM: "bg-[var(--badge-warning-bg)] text-processing",
    LOW: "bg-[var(--badge-neutral-bg)] text-pending",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[confidence],
      )}
    >
      {confidence.charAt(0) + confidence.slice(1).toLowerCase()}
    </span>
  );
}
