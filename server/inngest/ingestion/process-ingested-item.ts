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
import { extractProductAssets } from "@/server/services/product-assets/extract-product-assets";
import { saveItemAssets } from "@/server/db/queries/item-assets";
import { extractProductEnrichment } from "@/server/services/product-enrichment/extract-product-enrichment";
import { saveItemEnrichment } from "@/server/db/queries/item-enrichment";
import { normalizeProduct } from "@/server/services/product-normalization/normalize-product";
import { saveItemNormalization } from "@/server/db/queries/item-normalization";
import { buildProductContentContext } from "@/server/services/product-content/content-context";
import { generateProductContent } from "@/server/services/product-content/generate-product-content";
import { saveItemContent } from "@/server/db/queries/item-content";

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
    const productAssets = await step.run(
      "extract-product-assets",
      async () => {
        return extractProductAssets(
          classificationResult.manufacturerEvidence,
        );
      },
    );
    await step.run(
      "persist-product-assets",
      async () => {
        return saveItemAssets({
          ingestedItemId: item.id,
          productAssets,
        });
      },
    );
    const productEnrichment = await step.run(
      "enrich-product",
      async () => {
        return extractProductEnrichment(
          classificationResult.manufacturerEvidence,
        );
      },
    );
    await step.run(
      "persist-enrichment",
      async () => {
        return saveItemEnrichment({
          ingestedItemId: item.id,
          productEnrichment,
        });
      },
    );
    const productNormalization = await step.run(
      "normalize-product",
      async () => {
        return normalizeProduct(productEnrichment);
      },
    );
    await step.run(
      "persist-normalization",
      async () => {
        return saveItemNormalization({
          ingestedItemId: item.id,
          productNormalization,
        });
      },
    );
    const productContent = await step.run(
      "generate-product-content",
      async () => {
        const contentContext = buildProductContentContext(
          classificationResult.manufacturerEvidence,
          productNormalization,
        );
    
        return generateProductContent(contentContext);
      },
    );
    await step.run(
      "persist-product-content",
      async () => {
        return saveItemContent({
          ingestedItemId: item.id,
          productContent,
        });
      },
    );

    return { itemId: item.id, interpretationID: persistedInterpretation.id };
  },
);
