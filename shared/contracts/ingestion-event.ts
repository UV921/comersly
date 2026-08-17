import {z} from "zod"

export const ingestionItemReadyEventSchema=z.strictObject({
    itemId:z.uuid()
  })

  export const INGESTIIN_ITEM_READY_EVENT="ingestion/item.ready" as const;
 export type IngestionItemReadyEvent=z.infer<typeof ingestionItemReadyEventSchema >