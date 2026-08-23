import { readRawCell } from "./cell-value";
import type { ProductDeliveryCells, ProductDeliveryInput } from "./types";

/*
 * Raw input columns that the delivery format echoes back unchanged. The output
 * column name is identical to the input column name for all of them.
 *
 * Raw provenance is deliberately kept separate from canonical identity: in
 * particular Part_Manuf (the distributor's supplier label) is NOT a
 * manufacturer name and must never leak into MANUFACTURER_NAME.
 */
const RAW_PASSTHROUGH_COLUMNS = [
  "Mfg_Part_Num",
  "Part_Desc",
  "E1_Brand",
  "Unilog_Brand",
  "DIB_Brand",
  "Part_Manuf",
] as const;

export function mapRawFields(
  input: Pick<ProductDeliveryInput, "rawData">,
): ProductDeliveryCells {
  const cells: ProductDeliveryCells = {};

  for (const column of RAW_PASSTHROUGH_COLUMNS) {
    cells[column] = readRawCell(input.rawData, column);
  }

  return cells;
}
