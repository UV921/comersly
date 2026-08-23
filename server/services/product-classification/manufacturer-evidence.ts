import {z} from "zod"
export const manufacturerSourceTypeSchema = z.enum([
    "PRODUCT_PAGE",
    "DATASHEET",
    "CATALOG",
    "SUPPORT_PAGE",
  ]);
  
  export const identityMatchSchema = z.enum([
    "EXACT",
    "STRONG",
    "WEAK",
  ]);

export const manufacturerClassificationEvidenceSchema=z.strictObject({
    manufacturerPartNumber:z.string().min(1).nullable(),
    manufacturerName:z.string().min(1).nullable(),
    brandName:z.string().min(1).nullable(),
    productName:z.string().min(1).nullable(),
    productType:z.string().min(1).nullable(),
    series:z.string().min(1).nullable(),
    manufacturerCategory:z.string().min(1).nullable(),
    sourceUrl:z.url(),
    sourceType:manufacturerSourceTypeSchema,
    identityMatch:identityMatchSchema,
    evidenceSummary:z.string().min(1)


    
    


})
export const manufacturerPageExtractionSchema = z.strictObject({
    manufacturerPartNumber: z.string().min(1).nullable(),
    manufacturerName: z.string().min(1).nullable(),
    brandName: z.string().min(1).nullable(),
    productName: z.string().min(1).nullable(),
    productType: z.string().min(1).nullable(),
    series: z.string().min(1).nullable(),
    manufacturerCategory: z.string().min(1).nullable(),
  
    sourceType: z.enum([
      "PRODUCT_PAGE",
      "DATASHEET",
      "CATALOG",
      "SUPPORT_PAGE",
    ]),
  
    evidenceSummary: z.string().min(1),
  });
export type ManufacturerClassificationEvidence = z.infer<
  typeof manufacturerClassificationEvidenceSchema
>;
export type ManufacturerPageExtraction = z.infer<
  typeof manufacturerPageExtractionSchema
>;