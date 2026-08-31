import Link from "next/link";

import type { DashboardMetrics } from "@/server/db/queries/workspace";

export function MetricCards({
  metrics,
  holderName,
}: {
  metrics: DashboardMetrics;
  holderName?: string | null;
}) {
  const percent =
    metrics.productsTotal > 0
      ? Math.round((metrics.productsProcessed / metrics.productsTotal) * 100)
      : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
      <Link
        href="/products"
        className="relative flex min-h-60 flex-col overflow-hidden rounded-[28px] bg-canvas p-6 sm:p-7"
      >
        <p className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
          Catalog
        </p>
        <p className="mt-8 text-5xl font-semibold tracking-tight tabular-nums">
          {metrics.productsProcessed}
        </p>
        <p className="mt-1 text-sm text-muted">
          {metrics.productsProcessed} of {metrics.productsTotal} products ready
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-auto flex items-end justify-between pt-6 text-sm">
          <span className="truncate text-muted">
            {holderName || "Catalog"}
          </span>
          <span className="tabular-nums text-muted">{percent}%</span>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Link
          href="/imports"
          className="flex min-h-28 flex-col justify-between rounded-[28px] bg-canvas px-5 py-5"
        >
          <p className="text-sm text-muted">In progress</p>
          <div>
            <p className="text-3xl font-semibold tabular-nums">
              {metrics.processingImports}
            </p>
            <p className="mt-1 text-xs text-muted">Imports still running</p>
          </div>
        </Link>
        <Link
          href="/products"
          className="flex min-h-28 flex-col justify-between rounded-[28px] bg-canvas px-5 py-5"
        >
          <p className="text-sm text-muted">Needs review</p>
          <div>
            <p className="text-3xl font-semibold tabular-nums">
              {metrics.needsReview}
            </p>
            <p className="mt-1 text-xs text-muted">Rows to check</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
