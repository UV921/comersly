import {z} from "zod"

export const confidenceSchema=z.enum(["HIGH","MEDIUM","LOW"])
export const interpretedCandidateSchema=z.strictObject({
    value:z.string().min(1),
    sourceColumn:z.string().min(1),
    confidence:confidenceSchema,
    reason:z.string().min(1)
})

export const interpretedAttributeSchema=interpretedCandidateSchema.extend({
    name:z.string().min(1)
})

export const interpretedItemSchema=z.strictObject({
    manufacturerPartNumber:interpretedCandidateSchema.nullable(),
    manufacturerCandidates:z.array(interpretedCandidateSchema),
    brandCandidates:z.array(interpretedCandidateSchema),
    attributes:z.array(interpretedAttributeSchema)
})

export type InterpretedCandidate=z.infer<typeof interpretedCandidateSchema>
export type IntepretedConfidence=z.infer<typeof confidenceSchema>
export type InterpretedAttribute=z.infer<typeof interpretedAttributeSchema>
export type InterpretedItem= z.infer<typeof interpretedItemSchema>