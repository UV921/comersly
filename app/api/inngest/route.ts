import {serve} from "inngest/next"
import {inngest} from "@/server/inngest/client"
import { processIngestedFunction } from "@/server/inngest/ingestion/process-ingested-item"


export const {GET,POST,PUT}=serve({
    client:inngest,
    functions:[processIngestedFunction]

})