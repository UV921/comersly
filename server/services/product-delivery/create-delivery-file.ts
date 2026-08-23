import {
  DELIVERY_CONTENT_TYPES,
  buildDeliveryFileName,
  type DeliveryFormat,
} from "./delivery-format";
import { buildProductDeliveryRows } from "./map-product-delivery-row";
import { serializeDeliveryCsv } from "./serialize-csv";
import { serializeDeliveryXlsx } from "./serialize-xlsx";
import type { ProductDeliveryInput } from "./types";

export type DeliveryFile = {
  fileName: string;
  contentType: string;
  body: Buffer;
};

export type CreateDeliveryFileInput = {
  inputs: readonly ProductDeliveryInput[];
  format: DeliveryFormat;
  sourceFileName: string;
  importId: string;
};

/*
 * Turns persisted pipeline output into a downloadable file.
 *
 * The projection runs once and both serializers consume the exact same rows, so
 * the CSV and the XLSX for an import are always the same data in two
 * containers.
 */
export function createDeliveryFile({
  inputs,
  format,
  sourceFileName,
  importId,
}: CreateDeliveryFileInput): DeliveryFile {
  const rows = buildProductDeliveryRows(inputs);

  const body =
    format === "csv"
      ? Buffer.from(serializeDeliveryCsv(rows), "utf8")
      : serializeDeliveryXlsx(rows);

  return {
    fileName: buildDeliveryFileName(sourceFileName, importId, format),
    contentType: DELIVERY_CONTENT_TYPES[format],
    body,
  };
}
