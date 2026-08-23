import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { AutoRefresh } from "@/components/workspace/auto-refresh";
import { ExportActions } from "@/components/workspace/export-actions";
import { ImportPipeline } from "@/components/workspace/pipeline";
import { ImportStatusBadge } from "@/components/workspace/status-badge";
import { PageHeader } from "@/components/workspace/page-header";
import { ProductTable } from "@/components/workspace/product-table";
import { getImportForUser } from "@/server/db/queries/imports";
import {
  getImportPipelineCounts,
  listImportProductsForUser,
} from "@/server/db/queries/workspace";
import { formatDateTime } from "@/lib/product-display";

export default async function ImportDetailPage({
  params,
}: {
  params: Promise<{ importId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { importId } = await params;
  const importRecord = await getImportForUser(importId, userId);

  if (!importRecord) {
    notFound();
  }

  const [counts, products] = await Promise.all([
    getImportPipelineCounts(importRecord.id),
    listImportProductsForUser(importRecord.id, userId),
  ]);

  const isActive =
    importRecord.status === "PENDING" || importRecord.status === "PROCESSING";

  return (
    <>
      <AutoRefresh active={isActive} />
      <PageHeader
        title={importRecord.fileName}
        description="Product intelligence progress for this spreadsheet."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Status
          </p>
          <div className="mt-2">
            <ImportStatusBadge status={importRecord.status} />
          </div>
        </div>
        <div className="surface-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Uploaded
          </p>
          <p className="mt-2 text-sm">{formatDateTime(importRecord.createdAt)}</p>
        </div>
        <div className="surface-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Rows
          </p>
          <p className="mt-2 text-sm">
            {counts.content}/{importRecord.totalRows} ready
          </p>
        </div>
        <div className="surface-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Format
          </p>
          <p className="mt-2 text-sm">{importRecord.sourceFormat}</p>
        </div>
      </div>

      {importRecord.status === "FAILED" && importRecord.failureMessage ? (
        <div className="mb-6 rounded-2xl border border-failed/20 bg-[var(--badge-danger-bg)] px-4 py-3 text-sm text-failed">
          {importRecord.failureMessage}
        </div>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-2xl tracking-tight">Processing pipeline</h2>
        <p className="mb-3 text-sm text-muted">
          Counts are taken from persisted stage results. A stage is complete
          for the import only when every product has that result.
        </p>
        <ImportPipeline counts={counts} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-2xl tracking-tight">Export</h2>
        <ExportActions importId={importRecord.id} status={importRecord.status} />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-2xl tracking-tight">Products</h2>
        {products.length === 0 ? (
          <p className="text-sm text-muted">No products found</p>
        ) : (
          <ProductTable products={products} />
        )}
      </section>
    </>
  );
}
