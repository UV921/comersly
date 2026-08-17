import { z } from "zod";

export const sourceFormat = ["CSV", "XLSX"] as const;
export const sourceFormatSchema = z.enum(sourceFormat);
export const sourceType = ["SPREADSHEET_ROW"] as const;
export const sourceTypeSchema = z.enum(sourceType);
export const importStatus = ["PENDING", "PROCESSING", "COMPLETED", "PARTIALLY_COMPLETED", "FAILED"] as const;
export const importStatusSchema = z.enum(importStatus);


export const rawDataSchema = z.record(z.string(), z.json());


export const sourceMetadataSchema = z.strictObject({
  fileName: z.string().min(1),
  sheetName: z.string().min(1).nullable(),
  rowNumber: z.int().positive(),
});

export const jsonValueSchema = z.json();



export type JsonValue = z.infer<typeof jsonValueSchema>;

export type SourceRawData = z.infer<typeof rawDataSchema>;
export type SourceMetadata = z.infer<typeof sourceMetadataSchema>;
export type SourceFormat = z.infer<typeof sourceFormatSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
export type ImportStatus = z.infer<typeof importStatusSchema>;


