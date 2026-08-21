import type { InterpretedCandidate } from "./schema";
import { DIRECT_SOURCE_FIELDS } from "./helper";

type DirectCandidateResult = {
  manufacturerPartNumber: InterpretedCandidate | null;
  manufacturerCandidates: InterpretedCandidate[];
  brandCandidates: InterpretedCandidate[];
};

function createDirectCandidate(
  sourceColumn: string,
  value: unknown,
): InterpretedCandidate | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  return {
    value: String(value),
    sourceColumn,
    confidence: "HIGH",
    reason: `Value is directly provided by the ${sourceColumn} source field.`,
  };
}

export function extractDirectCandidates(
  usableRawData: Record<string, unknown>,
): DirectCandidateResult {
  let manufacturerPartNumber: InterpretedCandidate | null = null;

  const manufacturerCandidates: InterpretedCandidate[] = [];
  const brandCandidates: InterpretedCandidate[] = [];

  for (const sourceColumn of DIRECT_SOURCE_FIELDS.manufacturerPartNumber) {
    const value = usableRawData[sourceColumn];

    if (value === undefined) {
      continue;
    }

    const candidate = createDirectCandidate(sourceColumn, value);

    if (candidate) {
      manufacturerPartNumber = candidate;
      break;
    }
  }

  for (const sourceColumn of DIRECT_SOURCE_FIELDS.manufacturerCandidates) {
    const value = usableRawData[sourceColumn];

    if (value === undefined) {
      continue;
    }

    const candidate = createDirectCandidate(sourceColumn, value);

    if (candidate) {
      manufacturerCandidates.push(candidate);
    }
  }

  for (const sourceColumn of DIRECT_SOURCE_FIELDS.brandCandidates) {
    const value = usableRawData[sourceColumn];

    if (value === undefined) {
      continue;
    }

    const candidate = createDirectCandidate(sourceColumn, value);

    if (candidate) {
      brandCandidates.push(candidate);
    }
  }

  return {
    manufacturerPartNumber,
    manufacturerCandidates,
    brandCandidates,
  };
}
