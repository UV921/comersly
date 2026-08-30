import Link from "next/link";

import type { DashboardMetrics, ImportListItem } from "@/server/db/queries/workspace";

export function NextSteps({
  metrics,
  imports,
}: {
  metrics: DashboardMetrics;
  imports: ImportListItem[];
}) {
  const exportable = imports.filter((item) => item.exportable).length;
  const running = imports.filter(
    (item) => item.status === "PROCESSING" || item.status === "PENDING",
  ).length;

  const steps = [
    running > 0
      ? {
          href: "/imports",
          title: `${running} still running`,
          detail: "Open imports to watch progress.",
        }
      : null,
    metrics.needsReview > 0
      ? {
          href: "/products",
          title: `${metrics.needsReview} need review`,
          detail: "Classification is uncertain.",
        }
      : null,
    exportable > 0
      ? {
          href: "/exports",
          title: `${exportable} ready to export`,
          detail: "Download the delivery file.",
        }
      : null,
  ].filter((step): step is { href: string; title: string; detail: string } => Boolean(step));

  if (steps.length === 0) {
    steps.push(
      metrics.totalImports === 0
        ? {
            href: "/upload",
            title: "Upload a spreadsheet",
            detail: "CSV or XLSX, one product per row.",
          }
        : {
            href: "/products",
            title: "Open the catalog",
            detail: "Identity, copy, and files.",
          },
    );
  }

  return (
    <div className="rounded-[28px] bg-surface-muted p-6">
      <h2 className="text-[15px] tracking-tight">Up next</h2>
      <ul className="mt-5 space-y-5">
        {steps.map((step) => (
          <li key={step.href + step.title}>
            <Link href={step.href} className="block">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted">{step.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
