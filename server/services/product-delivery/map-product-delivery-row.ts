import { createEmptyDeliveryRow } from "./create-empty-delivery-row";
import { mapAssets } from "./map-assets";
import { mapAttributes } from "./map-attributes";
import { mapClassification } from "./map-classification";
import { mapContent } from "./map-content";
import { mapIdentity } from "./map-identity";
import { mapRawFields } from "./map-raw-fields";
import { mapReferenceUrls } from "./map-reference-urls";
import type { ProductDeliveryInput, ProductDeliveryRow } from "./types";

/*
 * The single projection from persisted pipeline output to one delivery row.
 * Both the CSV and the XLSX export consume the rows this produces, so the two
 * files can never disagree.
 *
 * Every column starts blank and each mapper only writes the columns it can
 * genuinely support. Columns the pipeline has no verified source for - UPC,
 * EAN, GTIN, UNSPSC, pricing, packaging, dimensions, Country Of Origin,
 * Discontinued, Application, Includes, With, Standard/Approvals, Prop 65 and
 * the warranty facts - are therefore delivered blank rather than inferred from
 * marketing prose.
 */
export function mapProductDeliveryRow(
  input: ProductDeliveryInput,
): ProductDeliveryRow {
  return Object.assign(
    createEmptyDeliveryRow(),
    mapRawFields(input),
    mapIdentity(input),
    mapClassification(input),
    mapContent(input),
    mapAttributes(input),
    mapAssets(input),
    mapReferenceUrls(input),
  );
}

export function buildProductDeliveryRows(
  inputs: readonly ProductDeliveryInput[],
): ProductDeliveryRow[] {
  return inputs.map(mapProductDeliveryRow);
}
