import type { ProductDocumentAsset } from "@/server/services/product-assets/schema";

import { buildSlotHeaders, toDeliveryHeader } from "./delivery-header";
import type {
  ProductDeliveryCells,
  ProductDeliveryHeader,
  ProductDeliveryInput,
} from "./types";

type DocumentType = ProductDocumentAsset["documentType"];

const PRODUCT_IMAGE_HEADER = toDeliveryHeader("Product Image");

const ALTERNATE_IMAGE_HEADERS = buildSlotHeaders("Alternate Image", 4, " ");

const ACTUAL_IMAGE_HEADER = toDeliveryHeader("Actual Image (Yes/No)");

const VIDEO_HEADERS = [
  toDeliveryHeader("Video Link"),
  toDeliveryHeader("Video Link 1"),
] as const;

/*
 * Every document slot the delivery format offers, keyed by the pipeline's own
 * DocumentType enum. SDS is the only type with two columns. OTHER has no
 * column of its own and is intentionally left unmapped rather than being pushed
 * into an unrelated slot such as Catalog.
 *
 * `satisfies` keeps this exhaustive: adding a document type upstream without
 * deciding where it belongs here is a compile error.
 */
const DOCUMENT_TYPE_COLUMNS = {
  SDS: ["SDS", "SDS_1"],
  WARRANTY: ["Warranty Information"],
  CATALOG: ["Catalog"],
  SPECIFICATION_SHEET: ["Specification Sheet"],
  INSTRUCTION_MANUAL: ["Instruction/Installation Manual"],
  SERVICE_MANUAL: ["Service Manual"],
  USER_MANUAL: ["Owners/User Manual"],
  LINE_DRAWING: ["Line Drawing"],
  MTR: ["MTR"],
  ROHS: ["RoHS"],
  ENGINEERING_DRAWING: ["Full Engineering Drawing"],
  ENERGY_STAR_GUIDE: ["Energy Star Guide"],
  TECHNICAL_BULLETIN: ["Technical Bulletin"],
  SUBMITTAL: ["Submittal"],
  COMPATIBILITY_CHART: ["Compatibility Chart"],
  SIZE_CHART: ["Size Chart"],
  PRODUCT_LABEL: ["Product Label/Insert"],
  OTHER: [],
} as const satisfies Record<DocumentType, readonly string[]>;

const DOCUMENT_TYPE_HEADERS = new Map<
  DocumentType,
  readonly ProductDeliveryHeader[]
>(
  Object.entries(DOCUMENT_TYPE_COLUMNS).map(([documentType, columns]) => [
    documentType as DocumentType,
    columns.map(toDeliveryHeader),
  ]),
);

/*
 * Projects discovered images, documents and videos into their fixed columns.
 *
 * Assets are consumed in persisted order and the first asset to claim a slot
 * keeps it, so the same input always produces the same output. Assets that do
 * not fit (a sixth image, a third video, a third SDS) are dropped from the
 * export only; they stay in the item's persisted asset record and cannot
 * displace any other column.
 *
 * URLs are written exactly as discovered - never rewritten, proxied or renamed.
 */
export function mapAssets(
  input: Pick<ProductDeliveryInput, "assets">,
): ProductDeliveryCells {
  const assets = input.assets;

  if (!assets) {
    // The asset stage never produced a result for this item, so we do not know
    // whether a real manufacturer image exists. Blank, not "No".
    return {};
  }

  const cells: ProductDeliveryCells = {};

  const [primaryImage, ...alternateImages] = assets.images;

  if (primaryImage) {
    cells[PRODUCT_IMAGE_HEADER] = primaryImage.url;
  }

  ALTERNATE_IMAGE_HEADERS.forEach((header, index) => {
    const image = alternateImages[index];

    if (image) {
      cells[header] = image.url;
    }
  });

  cells[ACTUAL_IMAGE_HEADER] = assets.images.length > 0 ? "Yes" : "No";

  const usedDocumentHeaders = new Set<ProductDeliveryHeader>();

  for (const document of assets.documents) {
    const headers = DOCUMENT_TYPE_HEADERS.get(document.documentType);

    if (!headers) {
      throw new Error(
        `Document type "${document.documentType}" has no delivery column mapping`,
      );
    }

    const header = headers.find((slot) => !usedDocumentHeaders.has(slot));

    if (!header) {
      continue;
    }

    usedDocumentHeaders.add(header);
    cells[header] = document.url;
  }

  VIDEO_HEADERS.forEach((header, index) => {
    const video = assets.videos[index];

    if (video) {
      cells[header] = video.url;
    }
  });

  return cells;
}
