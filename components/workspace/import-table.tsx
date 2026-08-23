import Link from "next/link";

import { formatDateTime } from "@/lib/product-display";
import type { ImportListItem } from "@/server/db/queries/workspace";

import { ImportStatusBadge } from "./status-badge";

export function ImportTable({
  imports,
  actionLabel = "Open",
}: {
  imports: ImportListItem[];
  actionLabel?: string;
}) {
  return (
    <div className="surface-card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-muted text-xs font-medium uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">File</th>
            <th className="px-4 py-2.5 font-medium">Products</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Created</th>
            <th className="px-4 py-2.5 font-medium">Progress</th>
            <th className="px-4 py-2.5 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {imports.map((item) => {
            const progress =
              item.totalRows > 0
                ? Math.round((item.readyCount / item.totalRows) * 100)
                : 0;

            return (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface-muted/60">
                <td className="px-4 py-3">
                  <Link href={`/imports/${item.id}`} className="font-medium text-foreground hover:underline">
                    {item.fileName}
                  </Link>
                  <div className="text-xs text-muted">{item.sourceFormat}</div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {item.readyCount}/{item.totalRows}
                </td>
                <td className="px-4 py-3">
                  <ImportStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-muted">{formatDateTime(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">{progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/imports/${item.id}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    {actionLabel}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
