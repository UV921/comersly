import { z } from "zod";

export const productContentSchema = z.strictObject({
  mobileDescription: z.string().min(1).nullable(),

  invoiceDescription: z.string().min(1).nullable(),

  shortDescription: z.string().min(1).nullable(),

  longDescription: z.string().min(1).nullable(),

  retailDescription: z.string().min(1).nullable(),

  marketingDescription: z.string().min(1).nullable(),

  features: z
    .array(z.string().min(1))
    .max(20),
});

export type ProductContent = z.infer<
  typeof productContentSchema
>;