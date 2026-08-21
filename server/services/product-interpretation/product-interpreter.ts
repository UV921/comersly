import { createSemanticOutput } from "./semantic-interpreter";
import { extractDirectCandidates } from "./direct-candidate-extraction";
import { prepareUsableRawData } from "./helper";
import { prepareSemanticInput } from "./helper";
import { interpretedItemSchema } from "./schema";

export async function interpretProduct(rawData: Record<string, unknown>) {
  const useableData = prepareUsableRawData(rawData);
  const directCandidateResult = extractDirectCandidates(useableData);
  const semanticInput = prepareSemanticInput(useableData);
  const semanticResult = await createSemanticOutput(semanticInput);

  const interpretedItem = {
    manufacturerPartNumber: directCandidateResult.manufacturerPartNumber,

    manufacturerCandidates: directCandidateResult.manufacturerCandidates,

    brandCandidates: directCandidateResult.brandCandidates,

    attributes: semanticResult,
  };

  const result = interpretedItemSchema.parse(interpretedItem);
  return result;
}
