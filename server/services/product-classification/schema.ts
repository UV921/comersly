import {z} from "zod"

export const classificationConfidenceSchema=z.enum([
    "HIGH",
    "MEDIUM",
    "LOW"
])

export const productClassificationSchema=z.strictObject({
    classpath:z.string().min(1).nullable(),
    confidence:classificationConfidenceSchema,
    reason:z.string().min(1),
    needsReview:z.boolean()

})
export const manufacturerSourceCandidateSchema = z.strictObject({
    url: z.url(),
    title: z.string().min(1).nullable(),
    searchQuery: z.string().min(1),
    resolvedUrl: z.url().nullable(),
  });

  

export const referenceClassificationSchema = z.strictObject({
  dept: z.string().min(1).nullable(),
  class: z.string().min(1).nullable(),
  fine: z.string().min(1).nullable(),
  classpath: z.string().min(1).nullable(),

  source: z.literal("PROVIDED_EXPECTED_OUTPUT"),
});

export const proposedClassificationSchema = z.strictObject({
    dept: z.string().min(1).nullable(),
    class: z.string().min(1).nullable(),
    fine: z.string().min(1).nullable(),
    classpath: z.string().min(1).nullable(),
  
    confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  
    reason: z.string().min(1),
  
    needsReview: z.boolean(),
  });
  
  export type ProposedClassification =
    z.infer<typeof proposedClassificationSchema>;

export type ReferenceClassification =
  z.infer<typeof referenceClassificationSchema>;

export type ProductClassification=z.infer<typeof productClassificationSchema>
export type ManufacturerSourceCandidate=z.infer<typeof manufacturerSourceCandidateSchema>