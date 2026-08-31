import Link from "next/link";

import { formatDate } from "@/lib/product-display";
import type { ImportListItem, PipelineCounts } from "@/server/db/queries/workspace";

function AreaChart({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  const series = values.length > 1 ? values : [0, values[0] ?? 0];
  const max = Math.max(...series, 1);
  const width = 320;
  const height = 128;
  const points = series.map((value, index) => {
    const x = (index / Math.max(series.length - 1, 1)) * width;
    const y = height - 18 - (value / max) * (height - 36);
    return [x, y] as const;
  });
  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`)
    .join(" ");
  const last = points.at(-1);
  const startLabel = labels[0];
  const endLabel = labels.at(-1);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="workspace-chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--chart)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--chart)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill="url(#workspace-chart-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--chart)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {last ? (
          <circle cx={last[0]} cy={last[1]} r="4" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
        ) : null}
      </svg>
      {startLabel && endLabel ? (
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

const PIPELINE_STAGES = [
  { key: "interpreted", label: "Interpreted" },
  { key: "classified", label: "Classified" },
  { key: "content", label: "Content" },
  { key: "assets", label: "Assets" },
] as const;

export function DashboardCharts({
  imports,
  pipeline,
}: {
  imports: ImportListItem[];
  pipeline: PipelineCounts;
}) {
  const readyTotal = imports.reduce((sum, item) => sum + item.readyCount, 0);
  const rowTotal = imports.reduce((sum, item) => sum + item.totalRows, 0);
  const readyPercent = rowTotal > 0 ? Math.round((readyTotal / rowTotal) * 100) : 0;

  const sorted = [...imports].sort(
    (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
  );
  const cumulative: number[] = [];
  const labels: string[] = [];
  for (const item of sorted) {
    cumulative.push((cumulative.at(-1) ?? 0) + item.readyCount);
    labels.push(formatDate(item.createdAt));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-canvas p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Catalog progress</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{readyPercent}%</p>
          </div>
          <p className="text-xs text-muted tabular-nums">
            {readyTotal}/{rowTotal}
          </p>
        </div>
        <div className="mt-3">
          {cumulative.length > 0 ? (
            <AreaChart values={cumulative} labels={labels} />
          ) : (
            <div className="flex h-32 items-end">
              <div className="h-px w-full bg-border" />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] bg-canvas p-5">
        <p className="text-sm text-muted">Pipeline</p>
        <ul className="mt-4 space-y-3">
          {PIPELINE_STAGES.map((stage) => {
            const done = pipeline[stage.key];
            const percent =
              pipeline.total > 0 ? Math.round((done / pipeline.total) * 100) : 0;

            return (
              <li key={stage.key}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span>{stage.label}</span>
                  <span className="tabular-nums text-muted">
                    {done}/{pipeline.total}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <Link
          href="/upload"
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground hover:bg-accent-hover"
        >
          Upload a file
        </Link>
      </div>
    </div>
  );
}
