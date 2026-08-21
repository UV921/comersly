import type { InterpretedItem } from "@/server/services/product-interpretation/schema";
import { db } from "..";
import   { itemInterpretation } from "../schema";
export async function upsertItemInterpretation(ingestedItemId:string,result:InterpretedItem){
  
  const response= await  db
    .insert(itemInterpretation)
    .values({
        ingestedItemId,
      result,
    })
    .onConflictDoUpdate({
      target: itemInterpretation.ingestedItemId,
      set: {
        result,
        updatedAt: new Date(),
      },
    }).returning({id:itemInterpretation.id})
    return response[0]


}