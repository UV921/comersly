import type { InterpretedItem } from "../product-interpretation/schema";
import { ManufacturerClassificationEvidence } from "./manufacturer-evidence";

export type ClassificationContext = {
  rawData: Record<string, unknown>;
  interpretation: InterpretedItem;
  manufacturerEvidence: ManufacturerClassificationEvidence | null
};

export function buildClassificationContext(
  rawData: Record<string, unknown>,
  interpretation: InterpretedItem,
  manufacturerEvidence:ManufacturerClassificationEvidence | null
): ClassificationContext {
  return {
    rawData,
    interpretation,
    manufacturerEvidence,
  };
}