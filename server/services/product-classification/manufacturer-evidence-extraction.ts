import {
  manufacturerPageExtractionSchema,
  manufacturerClassificationEvidenceSchema,
  type ManufacturerClassificationEvidence,
  type ManufacturerPageExtraction,
} from "./manufacturer-evidence";
import type { ManufacturerSourceCandidate } from "./schema";
import type { ManufacturerSearchInput } from "./manufacturer-source-discovery";
import { ai } from "@/server/ai/client";
import { buildManufacturerEvidencePrompt } from "./prompt";
import { z } from "zod";
import {
  checkMpnInUrl,
  normalizeIdentity,
} from "./manufacturer-source-discovery";

function shouldPromoteIdentityToStrong(
  candidate: ManufacturerSourceCandidate,
  searchInput: ManufacturerSearchInput,
  extraction: ManufacturerPageExtraction,
): boolean {
  if (!searchInput.manufacturerPartNumber) {
    return false;
  }
  if (!candidate.resolvedUrl) {
    return false;
  }
  const mpnCheck = checkMpnInUrl(
    candidate.resolvedUrl,
    searchInput.manufacturerPartNumber,
  );
  if (mpnCheck !== "MATCH") {
    return false;
  }
  if (!extraction.brandName) {
    return false;
  }
  const noramlizedBrand = normalizeIdentity(extraction.brandName);
  const brandMatch = searchInput.brandCandidates.some((candidate) => {
    const noramalizedCandidateBrand = normalizeIdentity(candidate);
    if (noramalizedCandidateBrand.length === 0) {
      return false;
    }
    return noramlizedBrand === noramalizedCandidateBrand;
  });
  if (!brandMatch) {
    return false;
  }
  return true;
}

export async function extractManufacturerEvidenceFromPage(
  candidate: ManufacturerSourceCandidate,
  searchInput: ManufacturerSearchInput,
): Promise<ManufacturerClassificationEvidence | null> {
  if (!candidate.resolvedUrl) {
    throw new Error("Manufacturer candidate missing resolved URL");
  }
  const input = buildManufacturerEvidencePrompt(searchInput, candidate);
  const result = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",

    input: input,
    tools: [{ type: "url_context" }],
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(manufacturerPageExtractionSchema),
    },
  });
  
  if (!result.output_text) {
    throw new Error("There is no response given by the gemini");
  }
  const parsed = JSON.parse(result.output_text);
  const extraction = manufacturerPageExtractionSchema.parse(parsed);

  const expectedMpn = searchInput.manufacturerPartNumber;
  const extractedMpn = extraction.manufacturerPartNumber;

  let identityMatch: "EXACT" | "STRONG" | "WEAK" = "WEAK";

  if (expectedMpn && extractedMpn) {
    const normalizedExpected = normalizeIdentity(expectedMpn);
    const normalizedExtracted = normalizeIdentity(extractedMpn);

    if (normalizedExpected !== normalizedExtracted) {
      return null;
    }

    identityMatch = "EXACT";
  }
  if (!expectedMpn && extractedMpn) {
    identityMatch = "STRONG";
  }
  if (expectedMpn && !extractedMpn) {
    identityMatch = "WEAK";
  }
  if (!expectedMpn && !extractedMpn) {
    identityMatch = "WEAK";
  }

  if (
    identityMatch === "WEAK" &&
    shouldPromoteIdentityToStrong(candidate, searchInput, extraction)
  ) {
    identityMatch = "STRONG";
  }
  const finalClassficationEvidence = {
    ...extraction,
    sourceUrl: candidate.resolvedUrl,
    identityMatch,
  };
  const validatedFinalClassficationEvidence =
    manufacturerClassificationEvidenceSchema.parse(finalClassficationEvidence);
    console.log(validatedFinalClassficationEvidence)

  return validatedFinalClassficationEvidence;
}
