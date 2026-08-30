import { serve } from "inngest/next";
import { inngest } from "@/server/inngest/client";
import { processIngestedFunction } from "@/server/inngest/ingestion/process-ingested-item";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processIngestedFunction],
});
