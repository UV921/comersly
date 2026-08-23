import { ai } from "@/server/ai/client";
import type { ManufacturerClassificationEvidence } from "../product-classification/manufacturer-evidence";
import { productEnrichmentSchema, productPageEnrichmentSchema, type ProductEnrichment } from "./schema";
import { buildProductEnrichmentPrompt } from "./prompt";
import {z} from "zod"

export async function extractProductEnrichment(
  manufacturerEvidence: ManufacturerClassificationEvidence | null,
): Promise<ProductEnrichment> {
   
    
    if (!manufacturerEvidence) {
        return {
          attributes: [],
        };
}
const input=buildProductEnrichmentPrompt(manufacturerEvidence)
const result=await ai.interactions.create({
    model:"gemini-3.5-flash-lite",
    input,
    tools: [
        {
          type: "url_context",
        },
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: z.toJSONSchema(productPageEnrichmentSchema),
      },
})
if (!result.output_text) {
    throw new Error(
      "No response received for product enrichment",
    );
  }
  const parsed=JSON.parse(result.output_text)
  const validatedResult=productPageEnrichmentSchema.parse(parsed)
  const enrichmentWithSources = {
    attributes: validatedResult.attributes.map(
      (attribute) => ({
        ...attribute,
        sourceUrl: manufacturerEvidence.sourceUrl,
      }),
    ),
  };
  
  const finalresult=productEnrichmentSchema.parse(enrichmentWithSources)
  return finalresult


}