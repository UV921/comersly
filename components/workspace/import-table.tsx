import Link from "next/link";

import { formatDateTime } from "@/lib/product-display";
import type { ImportListItem } from "@/server/db/queries/workspace";

import { Card, CardHeader } from "./card";
import { ImportsIcon } from "./nav-icons";
import { ImportStatusBadge } from "./status-badge";

export function ImportTable({
  imports,
  title,
  actionHref = "/imports",
  actionLabel = "See all",
  framed = true,
}: {
  imports: ImportListItem[];
  title?: string;
  actionHref?: string;
  actionLabel?: string;
  framed?: boolean;
}) {
  const list = (
    <ul className="divide-y divide-border">
      {imports.map((item) => (
        <li key={item.id}>
          <Link href={`/imports/${item.id}`} className="flex items-center gap-3 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <ImportsIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.fileName}</p>
              <p className="mt-0.5 text-xs text-muted">
                {formatDateTime(item.createdAt)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums">
                {item.readyCount}/{item.totalRows}
              </p>
              <div className="mt-1 flex justify-end">
                <ImportStatusBadge status={item.status} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  const heading = title ? (
    <div className="mb-1 flex items-center justify-between gap-3">
      <h2 className="text-[15px] tracking-tight">{title}</h2>
      <Link href={actionHref} className="text-sm text-muted hover:text-foreground">
        {actionLabel}
      </Link>
    </div>
  ) : null;

  if (!framed) {
    return (
      <div className="rounded-[28px] bg-canvas px-5 py-4 sm:px-6">
        {heading}
        {list}
      </div>
    );
  }

  return (
    <Card>
      {title ? (
        <CardHeader
          title={title}
          action={
            <Link href={actionHref} className="text-sm text-muted hover:text-foreground">
              {actionLabel}
            </Link>
          }
        />
      ) : null}
      {list}
    </Card>
  );
}
