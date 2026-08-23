import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/workspace/empty-state";
import { PageHeader } from "@/components/workspace/page-header";
import { ProductTable } from "@/components/workspace/product-table";
import { listProductsForUser } from "@/server/db/queries/workspace";

export default async function ProductsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const products = await listProductsForUser(userId);

  return (
    <>
      <PageHeader
        title="Products"
        description="Enriched product records across your imports. Brand and manufacturer come from verified evidence, not spreadsheet supplier labels."
      />
      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Upload a spreadsheet to start generating product intelligence."
          actionHref="/upload"
          actionLabel="Upload Products"
        />
      ) : (
        <ProductTable products={products} showImport />
      )}
    </>
  );
}
