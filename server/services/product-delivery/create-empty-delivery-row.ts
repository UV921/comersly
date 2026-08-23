import { PRODUCT_DELIVERY_HEADERS } from "./headers";
import type { ProductDeliveryRow } from "./types";

/*
 * The starting point for every export row: all 252 columns present and blank.
 * Anything a mapper cannot support is therefore blank by construction rather
 * than by omission.
 */
export function createEmptyDeliveryRow(): ProductDeliveryRow {
  const row = {} as ProductDeliveryRow;

  for (const header of PRODUCT_DELIVERY_HEADERS) {
    row[header] = "";
  }

  return row;
}
