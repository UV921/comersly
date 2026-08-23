import { toCell } from "./cell-value";
import type { ProductDeliveryCells, ProductDeliveryInput } from "./types";

/*
 * Canonical identity comes only from verified manufacturer evidence. With no
 * evidence these columns stay blank; they are never back-filled from the raw
 * distributor columns, which would present unverified data as canonical.
 */
export function mapIdentity(
  input: Pick<ProductDeliveryInput, "manufacturerEvidence">,
): ProductDeliveryCells {
  const evidence = input.manufacturerEvidence;

  if (!evidence) {
    return {};
  }

  return {
    MANUFACTURER_NAME: toCell(evidence.manufacturerName),
    BRAND_NAME: toCell(evidence.brandName),
    MANUFACTURER_PART_NUMBER: toCell(evidence.manufacturerPartNumber),
    "Product Name": toCell(evidence.productName),
  };
}
