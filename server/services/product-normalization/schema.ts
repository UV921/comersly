import { z } from "zod";

export const normalizedAttributeSchema = z.strictObject({
  name: z.string().min(1),
  value: z.string().min(1),
  uom: z.string().min(1).nullable(),
  sourceUrl: z.string().url(),
});

export type NormalizedAttribute =
  z.infer<typeof normalizedAttributeSchema>;

export const productNormalizationSchema = z.strictObject({
  attributes: z.array(normalizedAttributeSchema),
});

export type ProductNormalization =
  z.infer<typeof productNormalizationSchema>;