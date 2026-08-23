import type { ManufacturerClassificationEvidence } from "@/server/services/product-classification/manufacturer-evidence";
import type {
  ProductClassification,
  ProposedClassification,
} from "@/server/services/product-classification/schema";
import type { ProductAssets } from "@/server/services/product-assets/schema";
import type { ProductContent } from "@/server/services/product-content/schema";
import type { ProductNormalization } from "@/server/services/product-normalization/schema";
import type { SourceRawData } from "@/shared/contracts/ingestion";

import type { PRODUCT_DELIVERY_HEADERS } from "./headers";

export type ProductDeliveryHeader = (typeof PRODUCT_DELIVERY_HEADERS)[number];

/*
 * Exactly one string cell per delivery column. Missing business data is the
 * empty string, never null and never a placeholder.
 */
export type ProductDeliveryRow = Record<ProductDeliveryHeader, string>;

export type ProductDeliveryCells = Partial<ProductDeliveryRow>;

/*
 * Everything the deterministic projection is allowed to read. Each stage is
 * nullable because an item may have been exported before every upstream stage
 * persisted a result; a missing stage yields blank cells, not an error.
 */
export type ProductDeliveryInput = {
  rawData: SourceRawData;
  manufacturerEvidence: ManufacturerClassificationEvidence | null;
  verifiedClassification: ProductClassification | null;
  proposedClassification: ProposedClassification | null;
  normalization: ProductNormalization | null;
  content: ProductContent | null;
  assets: ProductAssets | null;
};
