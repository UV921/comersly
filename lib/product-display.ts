import type { SourceRawData } from "@/shared/contracts/ingestion";
import type { ProductClassification } from "@/server/services/product-classification/schema";
import type { ProposedClassification } from "@/server/services/product-classification/schema";

export function readRawText(
  rawData: SourceRawData,
  column: string,
): string | null {
  const value = rawData[column];

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
}

export function formatClassificationPath(
  classification:
    | Pick<ProductClassification, "classpath">
    | Pick<ProposedClassification, "classpath" | "dept" | "class" | "fine">
    | null
    | undefined,
): string | null {
  if (!classification) {
    return null;
  }

  if (classification.classpath) {
    return classification.classpath;
  }

  if ("dept" in classification) {
    const parts = [
      classification.dept,
      classification.class,
      classification.fine,
    ].filter((part): part is string => Boolean(part));

    return parts.length > 0 ? parts.join(" > ") : null;
  }

  return null;
}

export function formatConfidence(
  confidence: "HIGH" | "MEDIUM" | "LOW" | null | undefined,
): string | null {
  if (!confidence) {
    return null;
  }

  return confidence.charAt(0) + confidence.slice(1).toLowerCase();
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  SDS: "SDS",
  WARRANTY: "Warranty",
  CATALOG: "Catalog",
  SPECIFICATION_SHEET: "Specification Sheet",
  INSTRUCTION_MANUAL: "Instruction Manual",
  SERVICE_MANUAL: "Service Manual",
  USER_MANUAL: "User Manual",
  LINE_DRAWING: "Line Drawing",
  MTR: "MTR",
  ROHS: "RoHS",
  ENGINEERING_DRAWING: "Engineering Drawing",
  ENERGY_STAR_GUIDE: "ENERGY STAR Guide",
  TECHNICAL_BULLETIN: "Technical Bulletin",
  SUBMITTAL: "Submittal",
  COMPATIBILITY_CHART: "Compatibility Chart",
  SIZE_CHART: "Size Chart",
  PRODUCT_LABEL: "Product Label",
  OTHER: "Other",
};

export function formatDocumentType(type: string): string {
  return DOCUMENT_TYPE_LABELS[type] ?? type.replaceAll("_", " ");
}
