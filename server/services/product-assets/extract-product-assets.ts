import type { ManufacturerClassificationEvidence } from "../product-classification/manufacturer-evidence";

import { discoverAssetCandidates } from "./discover-asset-candidates";

import {
  filterProductImageCandidates,
  filterProductLinkCandidates,
} from "./filter-asset-candidates";

import {
  classifyDocumentCandidate,
  createProductImageAsset,
} from "./classify-asset-candidates";

import {
  productAssetsSchema,
  type ProductAssets,
  type ProductDocumentAsset,
} from "./schema";

export async function extractProductAssets(
  manufacturerEvidence: ManufacturerClassificationEvidence | null,
): Promise<ProductAssets> {
  if (!manufacturerEvidence) {
    return {
      images: [],
      documents: [],
      videos: [],
    };
  }

  const sourceUrl = manufacturerEvidence.sourceUrl;

  const candidates = await discoverAssetCandidates(sourceUrl);

  const filteredImages = filterProductImageCandidates(
    candidates.images,
    manufacturerEvidence.manufacturerPartNumber,
  );

  const filteredLinks = filterProductLinkCandidates(
    candidates.links,
    manufacturerEvidence.manufacturerPartNumber,
  );

  const images = filteredImages.map((candidate) =>
    createProductImageAsset(candidate, sourceUrl),
  );

  const documents = filteredLinks
    .map((candidate) => classifyDocumentCandidate(candidate, sourceUrl))
    .filter((document): document is ProductDocumentAsset => document !== null);

  const result = {
    images,
    documents,
    videos: [],
  };

  return productAssetsSchema.parse(result);
}
