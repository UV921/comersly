import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/workspace/app-shell";
import { countActiveImports } from "@/server/db/queries/workspace";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const processingCount = await countActiveImports(userId);

  return <AppShell processingCount={processingCount}>{children}</AppShell>;
}
