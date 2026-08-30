import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AutoRefresh } from "@/components/workspace/auto-refresh";
import { DashboardCharts } from "@/components/workspace/dashboard-charts";
import { EmptyState } from "@/components/workspace/empty-state";
import { ImportTable } from "@/components/workspace/import-table";
import { MetricCards } from "@/components/workspace/metric-cards";
import { PageHeader } from "@/components/workspace/page-header";
import { PrimaryLink } from "@/components/workspace/buttons";
import { ProductStrip } from "@/components/workspace/product-table";
import { formatDate } from "@/lib/product-display";
import {
  getDashboardMetrics,
  getWorkspacePipelineCounts,
  listImportsForWorkspace,
  listProductsForUser,
} from "@/server/db/queries/workspace";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [user, metrics, imports, products, pipeline] = await Promise.all([
    currentUser(),
    getDashboardMetrics(userId),
    listImportsForWorkspace(userId),
    listProductsForUser(userId, { limit: 8 }),
    getWorkspacePipelineCounts(userId),
  ]);

  const greeting = user?.firstName
    ? `Welcome back, ${user.firstName}`
    : "Welcome back";
  const holderName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <>
      <AutoRefresh active={metrics.processingImports > 0} />
      <PageHeader
        title="Dashboard"
        description={`${greeting} · ${formatDate(new Date())}`}
        actions={<PrimaryLink href="/upload">Upload</PrimaryLink>}
      />

      <MetricCards metrics={metrics} holderName={holderName} />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
        {imports.length === 0 ? (
          <EmptyState
            title="No imports yet"
            description="Upload a CSV or XLSX. Each row becomes a product in the catalog."
            actionHref="/upload"
            actionLabel="Upload a spreadsheet"
          />
        ) : (
          <ImportTable
            title="Recent imports"
            imports={imports.slice(0, 8)}
            framed={false}
          />
        )}
        <DashboardCharts imports={imports} pipeline={pipeline} />
      </div>

      {products.length > 0 ? (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[15px] tracking-tight">Recent products</h2>
            <Link href="/products" className="text-sm text-muted hover:text-foreground">
              Catalog
            </Link>
          </div>
          <ProductStrip products={products} />
        </section>
      ) : null}
    </>
  );
}
