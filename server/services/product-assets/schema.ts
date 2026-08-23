import { z } from "zod";

export const productImageAssetSchema = z.strictObject({
  url: z.url(),

  // Manufacturer page where this image was discovered
  sourceUrl: z.url(),

  // Only if the manufacturer page provides alt/label text
  altText: z.string().min(1).nullable(),
});

export const documentTypeSchema = z.enum([
  "SDS",
  "WARRANTY",
  "CATALOG",
  "SPECIFICATION_SHEET",
  "INSTRUCTION_MANUAL",
  "SERVICE_MANUAL",
  "USER_MANUAL",
  "LINE_DRAWING",
  "MTR",
  "ROHS",
  "ENGINEERING_DRAWING",
  "ENERGY_STAR_GUIDE",
  "TECHNICAL_BULLETIN",
  "SUBMITTAL",
  "COMPATIBILITY_CHART",
  "SIZE_CHART",
  "PRODUCT_LABEL",
  "OTHER",
]);

export const productDocumentAssetSchema = z.strictObject({
  url: z.url(),

  sourceUrl: z.url(),

  // e.g. "DCD799B Instruction Manual"
  title: z.string().min(1).nullable(),

  documentType: documentTypeSchema,
});

export const productVideoAssetSchema = z.strictObject({
  url: z.url(),

  sourceUrl: z.url(),

  title: z.string().min(1).nullable(),
});
export const productAssetsSchema = z.strictObject({
  images: z.array(productImageAssetSchema),
  documents: z.array(productDocumentAssetSchema),
  videos: z.array(productVideoAssetSchema),
});

export type ProductAssets = z.infer<typeof productAssetsSchema>;

export type ProductVideoAsset = z.infer<typeof productVideoAssetSchema>;

export type ProductDocumentAsset = z.infer<typeof productDocumentAssetSchema>;

export type ProductImageAsset = z.infer<typeof productImageAssetSchema>;
