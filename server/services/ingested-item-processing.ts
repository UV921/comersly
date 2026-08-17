import { getIngestedItemById } from "../db/queries/ingested-items";


export async function processIngestedItem(itemId:string) {
    const item= await getIngestedItemById(itemId)
    if(!item){
        throw new Error("There is not an item for this ID")
    }
    return item;

    
}