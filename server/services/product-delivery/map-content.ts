import { toCell } from "./cell-value";
import { buildSlotHeaders } from "./delivery-header";
import type { ProductDeliveryCells, ProductDeliveryInput } from "./types";

const ITEM_FEATURE_HEADERS = buildSlotHeaders("ITEM_FEATURES_", 20, "");

/*
 * Copies already-generated content through verbatim. Delivery never rewrites,
 * truncates or regenerates copy, and never pads the feature slots by repeating
 * a feature: unused slots stay blank.
 *
 * Features beyond the 20 available slots are dropped from the export only; the
 * persisted content record keeps them.
 */
export function mapContent(
  input: Pick<ProductDeliveryInput, "content">,
): ProductDeliveryCells {
  const content = input.content;

  if (!content) {
    return {};
  }

  const cells: ProductDeliveryCells = {
    MOBILE_DESC: toCell(content.mobileDescription),
    INVOICE_DESC: toCell(content.invoiceDescription),
    SHORT_DESC: toCell(content.shortDescription),
    LONG_DESC1: toCell(content.longDescription),
    RETAIL_DESC: toCell(content.retailDescription),
    MARKETING_DESCRIPTION: toCell(content.marketingDescription),
  };

  ITEM_FEATURE_HEADERS.forEach((header, index) => {
    cells[header] = toCell(content.features[index]);
  });

  return cells;
}
