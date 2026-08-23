import type { DashboardMetrics } from "@/server/db/queries/workspace";

const CARDS: Array<{
  key: keyof DashboardMetrics;
  label: string;
}> = [
  { key: "totalImports", label: "Total imports" },
  { key: "productsProcessed", label: "Products processed" },
  { key: "processingImports", label: "Processing" },
  { key: "needsReview", label: "Needs review" },
  { key: "completedImports", label: "Completed" },
];

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-lg border border-border bg-surface px-4 py-3"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {metrics[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
