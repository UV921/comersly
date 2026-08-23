import { z } from "zod";

export const deliveryFormat = ["csv", "xlsx"] as const;

export const deliveryFormatSchema = z.enum(deliveryFormat);

export type DeliveryFormat = z.infer<typeof deliveryFormatSchema>;

export const DELIVERY_CONTENT_TYPES: Record<DeliveryFormat, string> = {
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const UNSAFE_FILE_NAME_CHARACTERS = /[^A-Za-z0-9._-]+/g;

const MAX_FILE_NAME_STEM_LENGTH = 80;

/*
 * Builds a stable, header-safe download name from the uploaded file name.
 *
 * The stem is reduced to ASCII word characters so it cannot inject quotes or
 * line breaks into the Content-Disposition header, and falls back to the import
 * id when nothing usable survives.
 */
export function buildDeliveryFileName(
  sourceFileName: string,
  importId: string,
  format: DeliveryFormat,
): string {
  const stem = sourceFileName
    .replace(/\.[^.]+$/, "")
    .replaceAll(UNSAFE_FILE_NAME_CHARACTERS, "-")
    .replace(/^[-._]+/, "")
    .replace(/[-._]+$/, "")
    .slice(0, MAX_FILE_NAME_STEM_LENGTH);

  const safeStem = stem.length > 0 ? stem : `import-${importId}`;

  return `${safeStem}-delivery.${format}`;
}
