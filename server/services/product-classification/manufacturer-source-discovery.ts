
import { normalize } from "path";
import type { InterpretedItem } from "../product-interpretation/schema";
import type { ManufacturerSourceCandidate } from "./schema";
import {
 
  manufacturerSourceCandidateSchema,
} from "./schema";
import { ai } from "@/server/ai/client";

export type ManufacturerSearchInput = {
  manufacturerPartNumber: string | null;
  brandCandidates: string[];
  manufacturerCandidates: string[];
  description: string | null;
};
function getHostname(url: string): string {
    return new URL(url).hostname;
  }

export function buildManufacturerSearchInput(
  rawData: Record<string, unknown>,
  interpretation: InterpretedItem,
) {
  const manufacturerPartNumber =
    interpretation.manufacturerPartNumber?.value ?? null;
  const brandCandidates = interpretation.brandCandidates.map((e) => {
    return e.value;
  });
  const manufacturerCandidates = interpretation.manufacturerCandidates.map(
    (e) => {
      return e.value;
    },
  );
  const rawDescription = rawData["Part_Desc"];

  const description =
    typeof rawDescription === "string" && rawDescription.trim().length > 0
      ? rawDescription.trim()
      : null;

  return {
    manufacturerPartNumber,
    brandCandidates,
    manufacturerCandidates,
    description,
  };
}
export function buildManufacturerSearchQueries(
  input: ManufacturerSearchInput,
): string[] {
  const queries: string[] = [];

  const {
    manufacturerPartNumber,
    brandCandidates,
    manufacturerCandidates,
    description,
  } = input;

  if (manufacturerPartNumber) {
    for (const brand of brandCandidates) {
      queries.push(`${brand} ${manufacturerPartNumber} official product`);
    }

    for (const manufacturer of manufacturerCandidates) {
      queries.push(
        `${manufacturer} ${manufacturerPartNumber} official product`,
      );
    }

    if (brandCandidates.length === 0 && manufacturerCandidates.length === 0) {
      queries.push(`${manufacturerPartNumber} official manufacturer product`);
    }
  } else if (description) {
    for (const brand of brandCandidates) {
      queries.push(`${brand} ${description} official product`);
    }

    for (const manufacturer of manufacturerCandidates) {
      queries.push(`${manufacturer} ${description} official product`);
    }

    if (brandCandidates.length === 0 && manufacturerCandidates.length === 0) {
      queries.push(`${description} official manufacturer product`);
    }
  }

  return [...new Set(queries)];
}
export function normalizeIdentity(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

async function resolveFinalUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const redirectUrl = response.url;
  return redirectUrl;
}
function isLikelyManufacturerCandidate(
  candidate: ManufacturerSourceCandidate,
  searchInput: ManufacturerSearchInput,
): boolean {
  const identities = [
    ...searchInput.brandCandidates,
    ...searchInput.manufacturerCandidates,
  ];
  const normalizedTitle = normalizeIdentity(candidate.title ?? "");

const match = identities.some((identity) => {
  const normalizedIdentity = normalizeIdentity(identity);

    return normalizedTitle.includes(normalizedIdentity);
});
return match
}
function isHostnameRelatedToIdentity(
    hostname: string,
    searchInput: ManufacturerSearchInput,
  ): boolean {
    const identities=[
        ...searchInput.brandCandidates,
        ...searchInput.manufacturerCandidates
    ]
    const normalizeHostName=normalizeIdentity(hostname)
    const isMatch=identities.some(identity=>{
        const noramlizeidentitty=normalizeIdentity(identity)
        if(noramlizeidentitty.length===0){
            return false
        }
       return normalizeHostName.includes(noramlizeidentitty)

    }
    )
    return isMatch

  }

 export function checkMpnInUrl(
    resolvedUrl: string,
    expectedMpn: string,
  ): "MATCH" | "UNKNOWN" {
     const normalizedMpn=normalizeIdentity(expectedMpn)
     const Path=new URL(resolvedUrl).pathname
     const normalizedPath=normalizeIdentity(Path)
    const isMpnInUrl= normalizedPath.includes(normalizedMpn)
    if(isMpnInUrl)return "MATCH"
    
        return "UNKNOWN"
    
  }

export async function discoverManufacturerSourceCandidates(
  queries: string[],
  searchInput: ManufacturerSearchInput,
): Promise<ManufacturerSourceCandidate[]> {
  if (queries.length === 0) {
    return [];
  }
  const allCandidates: ManufacturerSourceCandidate[] = [];
  
  for (const input of queries) {
    console.time(`search-${input}`);
    const result = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: input,
      tools: [{ type: "google_search" }],
      generation_config:{
        thinking_level:"low"
      }
    });
    console.timeEnd(`search-${input}`);

    const modelOutputStep = result.steps.find(
      (step) => step.type === "model_output",
    );
    if (!modelOutputStep) {
      throw new Error("Gemini search response missing model output");
    }
    const textContent = modelOutputStep?.content?.find(
      (content) => content.type === "text",
    );
    if (!textContent) {
      throw new Error("Gemini model output missing text content");
    }
    const urlCitations =
      textContent.annotations?.filter(
        (annotation) => annotation.type === "url_citation",
      ) ?? [];

    const candidate = urlCitations.map((citation) => {
      return {
        url: citation.url,
        title: citation.title ?? null,
        searchQuery: input,
        resolvedUrl: null,
      };
    });
    const validatedCandiates = candidate.map((candidate) =>
      manufacturerSourceCandidateSchema.parse(candidate),
    );
    allCandidates.push(...validatedCandiates);
  }
  const seenUrls = new Set<string>();
  const uniqueCandidates = allCandidates.filter((candidate) => {
    if (seenUrls.has(candidate.url)) {
      return false;
    } else {
      seenUrls.add(candidate.url);
      return true;
    }
  });
  const likelyCandidates = uniqueCandidates.filter((candidate) =>
    isLikelyManufacturerCandidate(candidate, searchInput),
  );
  console.log(
    "Likely manufacturer candidates:",
    likelyCandidates.map((candidate) => candidate.title),
  );

  const resolvedCandidates: ManufacturerSourceCandidate[] = [];

  for (const candidate of likelyCandidates) {
    console.time(`resolve-${candidate.title}`);

    const finalUrl = await resolveFinalUrl(candidate.url);

    console.timeEnd(`resolve-${candidate.title}`);
    const hostname=getHostname(finalUrl)
    const isRelated=isHostnameRelatedToIdentity(hostname,searchInput)
    if(!isRelated){
        continue
    }
    if (searchInput.manufacturerPartNumber) {
        const mpnUrlCheck = checkMpnInUrl(
          finalUrl,
          searchInput.manufacturerPartNumber,
        );
      
        console.log("MPN URL check:", mpnUrlCheck, finalUrl);
      }

    resolvedCandidates.push({
      ...candidate,
      resolvedUrl: finalUrl,
    });
  }
  const seenResolvedUrls = new Set<string>();
  const uniqueResolvedCandidates=resolvedCandidates.filter((candidate)=>{
    if (!candidate.resolvedUrl) {
        throw new Error("Resolved candidate missing resolved URL");
      }
    if(seenResolvedUrls.has(candidate.resolvedUrl)){
        return false
    }else{
        seenResolvedUrls.add(candidate.resolvedUrl)
        return true
    }
  })


  return uniqueResolvedCandidates;
}
