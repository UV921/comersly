import type { ManufacturerClassificationEvidence } from "../product-classification/manufacturer-evidence";
import type { ProductNormalization } from "../product-normalization/schema";

export type ProductContentContext = {
  identity: {
    manufacturerPartNumber: string | null;
    manufacturerName: string | null;
    brandName: string | null;
    productName: string | null;
    productType: string | null;
    series: string | null;
  };

  attributes: ProductNormalization["attributes"];
};

export function buildProductContentContext(
  manufacturerEvidence: ManufacturerClassificationEvidence | null,
  normalization: ProductNormalization,
): ProductContentContext {
  return {
    identity: {
      manufacturerPartNumber:
        manufacturerEvidence?.manufacturerPartNumber ?? null,

      manufacturerName:
        manufacturerEvidence?.manufacturerName ?? null,

      brandName:
        manufacturerEvidence?.brandName ?? null,

      productName:
        manufacturerEvidence?.productName ?? null,

      productType:
        manufacturerEvidence?.productType ?? null,

      series:
        manufacturerEvidence?.series ?? null,
    },

    attributes: normalization.attributes,
  };
}