import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/workspace/empty-state";
import { ExportActions } from "@/components/workspace/export-actions";
import { PageHeader } from "@/components/workspace/page-header";
import { ImportStatusBadge } from "@/components/workspace/status-badge";
import { listImportsForWorkspace } from "@/server/db/queries/workspace";
import { formatDateTime } from "@/lib/product-display";
import { isImportExportable } from "@/server/services/product-delivery/export-readiness";

export default async function ExportsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const imports = await listImportsForWorkspace(userId);
  const exportable = imports.filter((item) => isImportExportable(item.status));

  return (
    <>
      <PageHeader
        title="Exports"
        description="Download completed imports in the 252-column delivery format."
      />
      {exportable.length === 0 ? (
        <EmptyState
          title="No exports yet"
          description="Completed imports will appear here when processing has finished."
          actionHref="/imports"
          actionLabel="View imports"
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted text-xs font-medium uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">File</th>
                <th className="px-4 py-2.5 font-medium">Products</th>
                <th className="px-4 py-2.5 font-medium">Completed</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {exportable.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{item.fileName}</td>
                  <td className="px-4 py-3 text-muted">
                    {item.readyCount}/{item.totalRows}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDateTime(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <ImportStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ExportActions importId={item.id} status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
