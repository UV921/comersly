import type { ImageAssetCandidate } from "./asset-candidates";
import type { LinkAssetCandidate } from "./asset-candidates";

function normalizeForMatch(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

 
export function filterProductImageCandidates(
  images: ImageAssetCandidate[],
  manufacturerPartNumber: string | null,
): ImageAssetCandidate[] {
  if (!manufacturerPartNumber) {
    return [];
  }

  const normalizedMpn =
    normalizeForMatch(manufacturerPartNumber);

  if (!normalizedMpn) {
    return [];
  }

  return images.filter((image) => {
    const normalizedUrl =
      normalizeForMatch(image.url);

    const normalizedAltText =
      image.altText
        ? normalizeForMatch(image.altText)
        : "";

    return (
      normalizedUrl.includes(normalizedMpn) ||
      normalizedAltText.includes(normalizedMpn)
    );
  });
}



export function filterProductLinkCandidates(
  links: LinkAssetCandidate[],
  manufacturerPartNumber: string | null,
): LinkAssetCandidate[] {
  if (!manufacturerPartNumber) {
    return [];
  }

  const normalizedMpn =
    normalizeForMatch(manufacturerPartNumber);

  if (!normalizedMpn) {
    return [];
  }

  return links.filter((link) => {
    const normalizedUrl =
      normalizeForMatch(link.url);

    const normalizedLabel =
      link.label
        ? normalizeForMatch(link.label)
        : "";

    const belongsToProduct =
      normalizedUrl.includes(normalizedMpn) ||
      normalizedLabel.includes(normalizedMpn);

    if (!belongsToProduct) {
      return false;
    }

    const pathname =
      new URL(link.url).pathname.toLowerCase();

    const looksLikeDocument =
      pathname.endsWith(".pdf") ||
      pathname.endsWith(".svg");

    return looksLikeDocument;
  });
}