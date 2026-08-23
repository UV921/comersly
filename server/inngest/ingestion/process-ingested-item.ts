import { inngest } from "@/server/inngest/client";
import { processIngestedItem } from "@/server/services/ingested-item-processing";
import { upsertItemInterpretation } from "@/server/db/queries/item-interpretations";
import { interpretProduct } from "@/server/services/product-interpretation/product-interpreter";
import {
  INGESTIIN_ITEM_READY_EVENT,
  IngestionItemReadyEvent,
  ingestionItemReadyEventSchema,
} from "@/shared/contracts/ingestion-event";
import { createClassificationResult } from "@/server/services/product-classification/create-classification-result";
import { saveItemClassification } from "@/server/db/queries/item-classification";
import { extractProductEnrichment } from "@/server/services/product-enrichment/extract-product-enrichment";
import { saveItemEnrichment } from "@/server/db/queries/item-enrichment";

export const processIngestedFunction = inngest.createFunction(
  {
    id: "process-ingested-item",
    triggers: {
      event: INGESTIIN_ITEM_READY_EVENT,
    },
  },
  async ({ event, step }) => {
    const { itemId } = await ingestionItemReadyEventSchema.parseAsync(
      event.data,
    );
    const item = await step.run("loaded-ingested-item", async () => {
      return processIngestedItem(itemId);
    });
    const interpretation = await step.run("interpret-product", async () => {
      return interpretProduct(item.rawData);
    });
    const persistedInterpretation = await step.run(
      "persist-interpretation",
      async () => {
        return upsertItemInterpretation(item.id, interpretation);
      },
    );
    const classificationResult = await step.run(
      "classify-product",
      async () => {
        return createClassificationResult({
          rawData: item.rawData,
          interpretation,
        });
      },
    );
    await step.run(
      "persist-classification",
      async () => {
        return saveItemClassification({
          ingestedItemId: item.id,
          classificationResult,
        });
      },
    );
    const productEnrichment=await step.run("enrich-product",
      async()=>{
        return extractProductEnrichment(classificationResult.manufacturerEvidence)
      }
    )
    await step.run(
      "persist-enrichment",
      async () => {
        return saveItemEnrichment({
          ingestedItemId: item.id,
          productEnrichment,
        });
      },
    );


    return { itemId: item.id, interpretationID: persistedInterpretation.id };
  },
);
