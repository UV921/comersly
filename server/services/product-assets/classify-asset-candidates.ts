import type {
    ImageAssetCandidate,
    LinkAssetCandidate,
  } from "./asset-candidates";
  
  import {
    productDocumentAssetSchema,
    productImageAssetSchema,
    type ProductDocumentAsset,
    type ProductImageAsset,
  } from "./schema";
  function cleanDocumentTitle(
    label: string | null,
    fileName: string | null,
  ): string | null {
    if (!label) {
      return fileName;
    }
  
    let title = label;
  
    if (fileName) {
      const escapedFileName = fileName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
  
      title = title.replace(
        new RegExp(escapedFileName, "gi"),
        " ",
      );
    }
  
    title = title
      .replace(/\b(pdf|svg)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  
    return title || fileName;
  }
export function classifyDocumentCandidate(
  candidate: LinkAssetCandidate,
  sourceUrl: string,
): ProductDocumentAsset | null {
  const parsedUrl = new URL(candidate.url);

  const pathname = decodeURIComponent(
    parsedUrl.pathname,
  ).toLowerCase();

  const label = candidate.label
    ?.toLowerCase()
    .trim() ?? "";

  const searchableText = `${label} ${pathname}`;

  let documentType:
    ProductDocumentAsset["documentType"];

  if (
    searchableText.includes("safety data sheet") ||
    searchableText.includes("sds")
  ) {
    documentType = "SDS";
  } else if (
    searchableText.includes("warranty")
  ) {
    documentType = "WARRANTY";
  } else if (
    searchableText.includes("specification sheet") ||
    searchableText.includes("spec sheet") ||
    searchableText.includes("specification_sheet")
  ) {
    documentType = "SPECIFICATION_SHEET";
  } else if (
    searchableText.includes("instruction manual") ||
    searchableText.includes("instruction_manual") ||
    searchableText.includes("installation manual") ||
    searchableText.includes("installation instructions")
  ) {
    documentType = "INSTRUCTION_MANUAL";
  } else if (
    searchableText.includes("service manual") ||
    searchableText.includes("service_manual")
  ) {
    documentType = "SERVICE_MANUAL";
  } else if (
    searchableText.includes("owners manual") ||
    searchableText.includes("owner's manual") ||
    searchableText.includes("user manual") ||
    searchableText.includes("operator manual")
  ) {
    documentType = "USER_MANUAL";
  } else if (
    searchableText.includes("exploded diagram") ||
    searchableText.includes("exploded_diagram") ||
    searchableText.includes("line drawing")
  ) {
    documentType = "LINE_DRAWING";
  } else if (
    searchableText.includes("engineering drawing") ||
    searchableText.includes("technical drawing") ||
    searchableText.includes("cad drawing")
  ) {
    documentType = "ENGINEERING_DRAWING";
  } else if (
    searchableText.includes("material test report") ||
    searchableText.includes("mill test report") ||
    /\bmtr\b/.test(searchableText)
  ) {
    documentType = "MTR";
  } else if (
    searchableText.includes("rohs")
  ) {
    documentType = "ROHS";
  } else if (
    searchableText.includes("energy star")
  ) {
    documentType = "ENERGY_STAR_GUIDE";
  } else if (
    searchableText.includes("technical bulletin")
  ) {
    documentType = "TECHNICAL_BULLETIN";
  } else if (
    searchableText.includes("submittal")
  ) {
    documentType = "SUBMITTAL";
  } else if (
    searchableText.includes("compatibility chart")
  ) {
    documentType = "COMPATIBILITY_CHART";
  } else if (
    searchableText.includes("size chart")
  ) {
    documentType = "SIZE_CHART";
  } else if (
    searchableText.includes("product label") ||
    searchableText.includes("product insert")
  ) {
    documentType = "PRODUCT_LABEL";
  } else if (
    searchableText.includes("catalog") ||
    searchableText.includes("catalogue")
  ) {
    documentType = "CATALOG";
  } else {
    documentType = "OTHER";
  }

  const fileName =
    pathname.split("/").filter(Boolean).at(-1) ?? null;

  const title = cleanDocumentTitle(
    candidate.label,
    fileName,
  );

  return productDocumentAssetSchema.parse({
    url: candidate.url,
    sourceUrl,
    title,
    documentType,
  });
}
export function createProductImageAsset(
    candidate: ImageAssetCandidate,
    sourceUrl: string,
  ): ProductImageAsset {
    return productImageAssetSchema.parse({
      url: candidate.url,
      sourceUrl,
      altText: candidate.altText,
    });
  }