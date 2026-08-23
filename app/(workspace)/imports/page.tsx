import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/workspace/empty-state";
import { ImportTable } from "@/components/workspace/import-table";
import { PageHeader } from "@/components/workspace/page-header";
import { PrimaryLink } from "@/components/workspace/buttons";
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
        description="Every uploaded spreadsheet and its enrichment progress."
        actions={<PrimaryLink href="/upload">Upload Products</PrimaryLink>}
      />
      {imports.length === 0 ? (
        <EmptyState
          title="No imports yet"
          description="Upload a CSV or XLSX file to create your first import."
          actionHref="/upload"
          actionLabel="Upload Products"
        />
      ) : (
        <ImportTable imports={imports} />
      )}
    </>
  );
}
