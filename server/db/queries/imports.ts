import { and, desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { importsTable } from "@/server/db/schema";

/*
 * Ownership is always resolved server side from the Clerk session: the user id
 * is part of the lookup rather than something the caller can assert. An import
 * that belongs to somebody else is indistinguishable from one that does not
 * exist.
 */
export function ownedImportFilter(importId: string, clerkUserId: string) {
  return and(
    eq(importsTable.id, importId),
    eq(importsTable.clerkUserId, clerkUserId),
  );
}

export async function getImportForUser(importId: string, clerkUserId: string) {
  const [importRecord] = await db
    .select()
    .from(importsTable)
    .where(ownedImportFilter(importId, clerkUserId))
    .limit(1);

  return importRecord ?? null;
}

export async function listImportsForUser(clerkUserId: string) {
  return db
    .select()
    .from(importsTable)
    .where(eq(importsTable.clerkUserId, clerkUserId))
    .orderBy(desc(importsTable.createdAt));
}
