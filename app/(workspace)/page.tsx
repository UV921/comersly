import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/workspace/empty-state";
import { ImportTable } from "@/components/workspace/import-table";
import { MetricCards } from "@/components/workspace/metric-cards";
import { PageHeader } from "@/components/workspace/page-header";
import { PrimaryLink } from "@/components/workspace/buttons";
import {
  getDashboardMetrics,
  listImportsForWorkspace,
} from "@/server/db/queries/workspace";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [metrics, imports] = await Promise.all([
    getDashboardMetrics(userId),
    listImportsForWorkspace(userId),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track product spreadsheet imports as Comersly identifies, verifies, and enriches each row."
        actions={<PrimaryLink href="/upload">Upload Products</PrimaryLink>}
      />

      <MetricCards metrics={metrics} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">Recent imports</h2>
        {imports.length === 0 ? (
          <EmptyState
            title="No imports yet"
            description="Upload your first product spreadsheet to start enrichment."
            actionHref="/upload"
            actionLabel="Upload your first product spreadsheet"
          />
        ) : (
          <ImportTable imports={imports.slice(0, 8)} />
        )}
      </section>
    </>
  );
}
