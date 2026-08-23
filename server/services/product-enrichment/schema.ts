import { z } from "zod";

export const enrichedAttributeSchema = z.strictObject({
  name: z.string().min(1),
  value: z.string().min(1),
  uom: z.string().min(1).nullable(),
  sourceUrl: z.url(),
});
export const extractedAttributeSchema = z.strictObject({
    name: z.string().min(1),
    value: z.string().min(1),
    uom: z.string().min(1).nullable(),
  });
  
  export const productPageEnrichmentSchema = z.strictObject({
    attributes: z.array(extractedAttributeSchema),
  });
  
  export type ProductPageEnrichment =
    z.infer<typeof productPageEnrichmentSchema>;

export const productEnrichmentSchema = z.strictObject({
    attributes: z.array(enrichedAttributeSchema),
  });
  
  export type ProductEnrichment =
    z.infer<typeof productEnrichmentSchema>;

export type EnrichedAttribute =
  z.infer<typeof enrichedAttributeSchema>;