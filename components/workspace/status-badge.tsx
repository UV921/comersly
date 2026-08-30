import { cn } from "@/lib/cn";
import type { ImportStatus } from "@/shared/contracts/ingestion";

const IMPORT_LABELS: Record<ImportStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Ongoing",
  COMPLETED: "Done",
  PARTIALLY_COMPLETED: "Partial",
  FAILED: "Failed",
};

export function ImportStatusBadge({ status }: { status: ImportStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        status === "COMPLETED" && "bg-accent-soft text-accent",
        status === "FAILED" && "bg-failed/10 text-failed",
        status === "PROCESSING" && "bg-processing/15 text-accent",
        (status === "PENDING" || status === "PARTIALLY_COMPLETED") &&
          "bg-surface-muted text-muted",
      )}
    >
      {IMPORT_LABELS[status]}
    </span>
  );
}

export function NeedsReviewBadge() {
  return (
    <span className="inline-flex rounded-full bg-review/15 px-2.5 py-0.5 text-[11px] font-medium text-review">
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
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        isReady ? "bg-accent-soft text-accent" : "bg-surface-muted text-muted",
      )}
    >
      {isReady ? "Ready" : "In progress"}
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

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        confidence === "HIGH" && "bg-accent-soft text-accent",
        confidence === "MEDIUM" && "bg-surface-muted text-foreground",
        confidence === "LOW" && "bg-review/15 text-review",
      )}
    >
      {confidence.charAt(0) + confidence.slice(1).toLowerCase()}
    </span>
  );
}
