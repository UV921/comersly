import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/workspace/empty-state";
import { PageHeader } from "@/components/workspace/page-header";
import { ProductTable } from "@/components/workspace/product-table";
import { listProductsForUser } from "@/server/db/queries/workspace";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { q } = await searchParams;
  const products = await listProductsForUser(userId);

  return (
    <>
      <PageHeader
        title="Catalog"
        description="Every product from your spreadsheets. Open one for identity, classification, and copy."
      />
      {products.length === 0 ? (
        <EmptyState
          title="The catalog is empty"
          description="Upload a spreadsheet to start generating product records."
          actionHref="/upload"
          actionLabel="Upload a spreadsheet"
        />
      ) : (
        <ProductTable
          key={q ?? ""}
          products={products}
          showImport
          initialQuery={q ?? ""}
        />
      )}
    </>
  );
}
