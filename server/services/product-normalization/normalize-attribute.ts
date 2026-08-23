import type { EnrichedAttribute } from "../product-enrichment/schema";
import type { NormalizedAttribute } from "./schema";

import { normalizeText } from "./normalize-text";
import { normalizeUom } from "./normalize-uom";

export function normalizeAttribute(
  attribute: EnrichedAttribute,
): NormalizedAttribute {
  return {
    name: normalizeText(attribute.name),
    value: normalizeText(attribute.value),
    uom: normalizeUom(attribute.uom),
    sourceUrl: attribute.sourceUrl,
  };
}