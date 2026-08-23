import type { ProductEnrichment } from "../product-enrichment/schema";

import {
  productNormalizationSchema,
  type ProductNormalization,
} from "./schema";

import { normalizeAttribute } from "./normalize-attribute";

export function normalizeProduct(
  enrichment: ProductEnrichment,
): ProductNormalization {
  const attributes = enrichment.attributes.map(
    (attribute) => normalizeAttribute(attribute),
  );

  return productNormalizationSchema.parse({
    attributes,
  });
}