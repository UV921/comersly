import { buildSlotHeaders, toDeliveryHeader } from "./delivery-header";
import type { ProductDeliveryCells, ProductDeliveryInput } from "./types";

const MFR_URL_HEADER = toDeliveryHeader("MFR URL");

const REF_URL_HEADERS = buildSlotHeaders("Ref URL", 5, " ");

/*
 * MFR URL is the manufacturer page the identity evidence came from.
 *
 * Ref URL 1..5 are the *other* manufacturer pages the pipeline actually read,
 * taken from the sourceUrl provenance that enrichment and asset extraction
 * already persisted. Nothing is discovered here and no URL is ever synthesised:
 * if the pipeline recorded no additional sources, the columns stay blank.
 *
 * These sources are already constrained to manufacturer-owned hostnames by
 * manufacturer source discovery, so delivery does not re-filter them against a
 * hardcoded marketplace blocklist.
 *
 * Collection order is fixed (attribute provenance, then document, image and
 * video provenance) and duplicates - including the MFR URL itself - are removed
 * so the same item always produces the same reference list.
 */
export function mapReferenceUrls(
  input: Pick<
    ProductDeliveryInput,
    "manufacturerEvidence" | "normalization" | "assets"
  >,
): ProductDeliveryCells {
  const manufacturerUrl = input.manufacturerEvidence?.sourceUrl ?? null;

  const cells: ProductDeliveryCells = {
    [MFR_URL_HEADER]: manufacturerUrl ?? "",
  };

  const candidates = [
    ...(input.normalization?.attributes ?? []).map(
      (attribute) => attribute.sourceUrl,
    ),
    ...(input.assets?.documents ?? []).map((document) => document.sourceUrl),
    ...(input.assets?.images ?? []).map((image) => image.sourceUrl),
    ...(input.assets?.videos ?? []).map((video) => video.sourceUrl),
  ];

  const seen = new Set<string>(manufacturerUrl ? [manufacturerUrl] : []);

  const referenceUrls: string[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate)) {
      continue;
    }

    seen.add(candidate);
    referenceUrls.push(candidate);

    if (referenceUrls.length === REF_URL_HEADERS.length) {
      break;
    }
  }

  REF_URL_HEADERS.forEach((header, index) => {
    const url = referenceUrls[index];

    if (url) {
      cells[header] = url;
    }
  });

  return cells;
}
