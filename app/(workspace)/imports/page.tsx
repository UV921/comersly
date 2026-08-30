import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/workspace/empty-state";
import { ImportTable } from "@/components/workspace/import-table";
import { PageHeader } from "@/components/workspace/page-header";
import { listImportsForWorkspace } from "@/server/db/queries/workspace";

export default async function ImportsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const imports = await listImportsForWorkspace(userId);

  return (
    <>
      <PageHeader
        title="Imports"
        description="Spreadsheets in the pipeline. Open a file to see stage-by-stage progress."
      />
      {imports.length === 0 ? (
        <EmptyState
          title="No imports yet"
          description="Upload a CSV or XLSX file to create your first import."
          actionHref="/upload"
          actionLabel="Upload products"
        />
      ) : (
        <ImportTable imports={imports} />
      )}
    </>
  );
}
