import { InterpretedItem } from "../product-interpretation/schema";
import { buildClassificationContext } from "./classification-context";
import type { ClassificationResult } from "./classification-result";
import { classifyProduct } from "./classify-product";
import { extractManufacturerEvidenceFromPage } from "./manufacturer-evidence-extraction";
import {
  buildManufacturerSearchInput,
  buildManufacturerSearchQueries,
  discoverManufacturerSourceCandidates,
} from "./manufacturer-source-discovery";
import { proposeClassification } from "./propose-classification";

type CreateClassificationResultInput = {
  rawData: Record<string, unknown>;
  interpretation: InterpretedItem;
};

export async function createClassificationResult(
  input: CreateClassificationResultInput,
): Promise<ClassificationResult> {
  const manufacturerSerchInput = buildManufacturerSearchInput(
    input.rawData,
    input.interpretation,
  );
  const queries = buildManufacturerSearchQueries(manufacturerSerchInput);
  const manufacturerCandidate = await discoverManufacturerSourceCandidates(
    queries,
    manufacturerSerchInput,
  );
  const candidate = manufacturerCandidate[0];
  let manufacturerEvidence = null;

  if (candidate) {
    manufacturerEvidence = await extractManufacturerEvidenceFromPage(
      candidate,
      manufacturerSerchInput,
    );
  }

  const classifcationContext = buildClassificationContext(
    input.rawData,
    input.interpretation,
    manufacturerEvidence,
  );
  const strictClassification = await classifyProduct(classifcationContext);
  const proposedClassification =
    await proposeClassification(classifcationContext);
  return {
    manufacturerEvidence,
    verifiedClassification: strictClassification,
    proposedClassification,
  };
}
