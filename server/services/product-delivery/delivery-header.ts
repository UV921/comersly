import { PRODUCT_DELIVERY_HEADER_SET } from "./headers";
import type { ProductDeliveryHeader } from "./types";

/*
 * Narrows a computed column name (e.g. "ATTRIBUTE_LABEL 7") to a real delivery
 * header. An unknown name means the mapper and the organizer template have
 * drifted apart, which is a programmer error rather than missing product data,
 * so it throws instead of silently dropping a cell.
 */
export function toDeliveryHeader(name: string): ProductDeliveryHeader {
  if (!PRODUCT_DELIVERY_HEADER_SET.has(name)) {
    throw new Error(`"${name}" is not a product delivery column`);
  }

  return name as ProductDeliveryHeader;
}

/*
 * Builds the numbered header slots for a repeating group, e.g.
 * buildSlotHeaders("ITEM_FEATURES_", 20, "") -> ITEM_FEATURES_1 .. ITEM_FEATURES_20
 */
export function buildSlotHeaders(
  prefix: string,
  count: number,
  separator: string,
): readonly ProductDeliveryHeader[] {
  const slots: ProductDeliveryHeader[] = [];

  for (let slot = 1; slot <= count; slot += 1) {
    slots.push(toDeliveryHeader(`${prefix}${separator}${slot}`));
  }

  return slots;
}
