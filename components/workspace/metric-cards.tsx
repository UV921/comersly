import Link from "next/link";

import type { DashboardMetrics } from "@/server/db/queries/workspace";

function CardChip() {
  return (
    <span className="relative block h-8 w-11 overflow-hidden rounded-md bg-[#d4b483]">
      <span className="absolute inset-y-1 left-1 w-px bg-black/15" />
      <span className="absolute inset-y-1 left-2.5 w-px bg-black/15" />
      <span className="absolute inset-x-1 top-1/2 h-px bg-black/15" />
    </span>
  );
}

function ContactlessMark() {
  return (
    <svg viewBox="0 0 22 22" className="h-6 w-6 text-white/70" aria-hidden>
      <path
        d="M8 7.2c1.6 1.5 1.6 6.1 0 7.6M11.2 5.4c2.4 2.3 2.4 8.9 0 11.2M14.4 3.8c3.2 3 3.2 11.4 0 14.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
        className="relative flex min-h-60 flex-col overflow-hidden rounded-[28px] bg-accent p-6 text-white sm:p-7"
      >
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-medium tracking-[0.22em] text-white/55 uppercase">
            Comersly
          </p>
          <ContactlessMark />
        </div>
        <div className="mt-7">
          <CardChip />
        </div>
        <p className="mt-8 text-5xl font-semibold tracking-tight tabular-nums">
          {metrics.productsProcessed}
        </p>
        <p className="mt-1 text-sm text-white/70">
          {metrics.productsProcessed} of {metrics.productsTotal} products ready
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-auto flex items-end justify-between pt-6 text-sm">
          <span className="truncate text-white/80">
            {holderName || "Catalog"}
          </span>
          <span className="tabular-nums text-white/70">{percent}%</span>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Link
          href="/imports"
          className="flex min-h-28 flex-col justify-between rounded-[28px] bg-surface px-5 py-5"
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
          className="flex min-h-28 flex-col justify-between rounded-[28px] bg-accent-soft px-5 py-5"
        >
          <p className="text-sm text-muted">Needs review</p>
          <div>
            <p className="text-3xl font-semibold tabular-nums text-accent">
              {metrics.needsReview}
            </p>
            <p className="mt-1 text-xs text-muted">Rows to check</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
