import { eq } from "drizzle-orm";
import { db } from "..";
import { ingestedItemsTable } from "../schema";

export const getIngestedItemById = async (id: string) => {
  const result = await db
    .select()
    .from(ingestedItemsTable)
    .where(eq(ingestedItemsTable.id, id)).limit(1);
 
  return result[0];
};
