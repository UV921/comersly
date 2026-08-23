import { toCell } from "./cell-value";
import { buildSlotHeaders } from "./delivery-header";
import type { ProductDeliveryCells, ProductDeliveryInput } from "./types";

const ATTRIBUTE_SLOT_COUNT = 50;

const ATTRIBUTE_LABEL_HEADERS = buildSlotHeaders(
  "ATTRIBUTE_LABEL",
  ATTRIBUTE_SLOT_COUNT,
  " ",
);

const ATTRIBUTE_VALUE_HEADERS = buildSlotHeaders(
  "ATTRIBUTE_VALUE",
  ATTRIBUTE_SLOT_COUNT,
  " ",
);

const ATTRIBUTE_UOM_HEADERS = buildSlotHeaders(
  "ATTRIBUTE_UOM",
  ATTRIBUTE_SLOT_COUNT,
  " ",
);

/*
 * Fills the label / value / UOM triplets in the order normalization produced
 * them. The order is never re-sorted, so the same product always lands in the
 * same slots.
 *
 * The format only has 50 triplets. Attributes past that point are dropped from
 * this export - they remain persisted - and cannot shift later columns because
 * every slot is addressed by name.
 */
export function mapAttributes(
  input: Pick<ProductDeliveryInput, "normalization">,
): ProductDeliveryCells {
  const attributes = input.normalization?.attributes ?? [];

  const cells: ProductDeliveryCells = {};

  for (let slot = 0; slot < ATTRIBUTE_SLOT_COUNT; slot += 1) {
    const attribute = attributes[slot];

    if (!attribute) {
      break;
    }

    cells[ATTRIBUTE_LABEL_HEADERS[slot]] = attribute.name;
    cells[ATTRIBUTE_VALUE_HEADERS[slot]] = attribute.value;
    cells[ATTRIBUTE_UOM_HEADERS[slot]] = toCell(attribute.uom);
  }

  return cells;
}
