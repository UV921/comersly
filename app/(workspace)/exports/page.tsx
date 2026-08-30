import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Card } from "@/components/workspace/card";
import { EmptyState } from "@/components/workspace/empty-state";
import { ExportActions } from "@/components/workspace/export-actions";
import { PageHeader } from "@/components/workspace/page-header";
import { ImportStatusBadge } from "@/components/workspace/status-badge";
import { listImportsForWorkspace } from "@/server/db/queries/workspace";
import { formatDateTime } from "@/lib/product-display";

export default async function ExportsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const imports = await listImportsForWorkspace(userId);
  const exportable = imports.filter((item) => item.exportable);

  return (
    <>
      <PageHeader
        title="Exports"
        description="Download the 252-column delivery file once every row in an import is ready."
      />
      {exportable.length === 0 ? (
        <EmptyState
          title="Nothing to download yet"
          description="Exports appear when an import has finished processing every row."
          actionHref="/imports"
          actionLabel="View imports"
        />
      ) : (
        <ul className="space-y-3">
          {exportable.map((item) => (
            <li key={item.id}>
              <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.fileName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.readyCount}/{item.totalRows} ready · {formatDateTime(item.createdAt)}
                  </p>
                  <div className="mt-2">
                    <ImportStatusBadge status={item.status} />
                  </div>
                </div>
                <ExportActions
                  importId={item.id}
                  status={item.status}
                  readyCount={item.readyCount}
                  totalCount={item.totalRows}
                />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
