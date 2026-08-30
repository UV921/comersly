import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { AutoRefresh } from "@/components/workspace/auto-refresh";
import { Card } from "@/components/workspace/card";
import { ExportActions } from "@/components/workspace/export-actions";
import { ImportPipeline } from "@/components/workspace/pipeline";
import { ImportStatusBadge } from "@/components/workspace/status-badge";
import { PageHeader } from "@/components/workspace/page-header";
import { ProductTable } from "@/components/workspace/product-table";
import { syncImportCompletion } from "@/server/db/queries/import-progress";
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
  let importRecord = await getImportForUser(importId, userId);

  if (!importRecord) {
    notFound();
  }

  if (
    importRecord.status === "PENDING" ||
    importRecord.status === "PROCESSING"
  ) {
    await syncImportCompletion(importRecord.id);
    importRecord = (await getImportForUser(importId, userId)) ?? importRecord;
  }

  const [counts, products] = await Promise.all([
    getImportPipelineCounts(importRecord.id),
    listImportProductsForUser(importRecord.id, userId),
  ]);

  const isActive =
    importRecord.status === "PENDING" || importRecord.status === "PROCESSING";
  const readyPercent =
    importRecord.totalRows > 0
      ? Math.round((counts.content / importRecord.totalRows) * 100)
      : 0;

  return (
    <>
      <AutoRefresh active={isActive} />
      <PageHeader
        crumbs={[
          { href: "/imports", label: "Imports" },
          { label: importRecord.fileName },
        ]}
        title={importRecord.fileName}
        description={`${importRecord.sourceFormat} · ${formatDateTime(importRecord.createdAt)} · ${counts.content} of ${importRecord.totalRows} products ready (${readyPercent}%)`}
        actions={<ImportStatusBadge status={importRecord.status} />}
      />

      {importRecord.status === "FAILED" && importRecord.failureMessage ? (
        <p className="mb-5 rounded-[20px] bg-failed/10 px-4 py-3 text-sm text-failed">
          {importRecord.failureMessage}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-5 text-base font-semibold tracking-tight">
            Pipeline progress
          </h2>
          <ImportPipeline counts={counts} />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold tracking-tight">Export</h2>
          <p className="mb-4 text-sm text-muted">
            Delivery files unlock when every row has content.
          </p>
          <ExportActions
            importId={importRecord.id}
            status={importRecord.status}
            readyCount={counts.content}
            totalCount={counts.total}
          />
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold tracking-tight">
          Products in this file
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-muted">No products found.</p>
        ) : (
          <ProductTable products={products} />
        )}
      </section>
    </>
  );
}
