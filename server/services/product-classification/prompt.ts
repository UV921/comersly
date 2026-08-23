import type { ClassificationContext } from "./classification-context";
import type { ManufacturerSearchInput } from "./manufacturer-source-discovery";
import type { ManufacturerSourceCandidate } from "./schema";

export function buildManufacturerEvidencePrompt(
  searchInput: ManufacturerSearchInput,candidate:ManufacturerSourceCandidate

): string {
  return `
Read only the provided manufacturer page.
${candidate.resolvedUrl}

Your task is to extract light product identity and classification evidence
that is explicitly supported by that page.

Expected product context:
- Expected MPN: ${searchInput.manufacturerPartNumber ?? "UNKNOWN"}
- Brand candidates: ${searchInput.brandCandidates.join(", ") || "UNKNOWN"}
- Manufacturer candidates: ${
    searchInput.manufacturerCandidates.join(", ") || "UNKNOWN"
  }
- Source description: ${searchInput.description ?? "UNKNOWN"}

IMPORTANT:
The expected product context above is provided only to help you determine
whether the page appears to represent the product we are looking for.

Do NOT copy any value from the expected product context into the output
unless the manufacturer page itself independently supports that value.

Every returned field must be based on information found on the provided page.

Rules:
- Use only information from the provided manufacturer page.
- Do not use outside knowledge.
- Do not search the web for additional information.
- Do not guess or invent missing values.
- Use null when a field is not explicitly supported by the page.
- Preserve manufacturer part numbers exactly as shown on the page.
- manufacturerPartNumber must come from the page itself, not from the expected MPN.
- manufacturerName must only be returned if the page itself supports that manufacturer identity.
- brandName must only be returned if the page itself supports that brand identity.
- productName should be the product name shown by the page.
- productType should describe what the product actually is, using only page-supported information.
- series should only be returned when the page explicitly identifies a product series or family.
- manufacturerCategory must only come from page-supported category, breadcrumb, navigation, or equivalent product grouping information.
- Do not convert the manufacturer's category into a Unilog Classpath.
- Do not perform final product classification.
- Do not normalize attributes or units.
- Do not generate marketing descriptions.
- sourceType must describe the type of manufacturer source being read.
- evidenceSummary should briefly explain what the page itself proves about this product.
`;
}



export function buildClassificationPrompt(
  context: ClassificationContext,
): string {
  const {
    rawData,
    interpretation,
    manufacturerEvidence,
  } = context;

  return `
You are classifying an industrial commerce product using ONLY the evidence provided below.

Your goal is to produce the most defensible classification result possible without inventing taxonomy, product facts, or unsupported relationships.

SOURCE RAW DATA:
${JSON.stringify(context.rawData, null, 2)}

INTERPRETED SOURCE FACTS:
${JSON.stringify(context.interpretation, null, 2)}

VERIFIED MANUFACTURER EVIDENCE:
${JSON.stringify(context.manufacturerEvidence, null, 2)}

IMPORTANT DATA LIMITATION:

We do NOT have the complete Unilog taxonomy or complete LOV/classification master.

Therefore:

- Do not claim that a generated path is a validated Unilog taxonomy path.
- Do not use outside knowledge to reconstruct the missing taxonomy.
- Do not assume that a familiar industry hierarchy is the Unilog hierarchy.
- The supplied evidence may identify the product very accurately while still being insufficient to produce a supported Classpath.

GENERAL RULES:

1. Use ONLY:
   - rawData
   - interpretation
   - manufacturerEvidence

2. Do NOT:
   - perform web search
   - use outside product knowledge
   - infer facts from the manufacturer part number using memory
   - invent specifications
   - invent manufacturer or brand
   - invent product categories
   - invent taxonomy levels

3. Treat manufacturerEvidence according to identityMatch:

   EXACT:
   - strongest evidence for exact product identity
   - may strongly support product type, series, category, and other page-supported facts

   STRONG:
   - useful supporting evidence
   - combine it with rawData and interpretation

   WEAK:
   - only a supporting hint
   - must not override clearer source-supported evidence

   null:
   - manufacturer verification was not available
   - classification may still be attempted using rawData and interpretation
   - reduce confidence or require review when evidence is insufficient

4. rawData and interpretation remain important.

Manufacturer evidence must not override explicit non-conflicting source facts simply because it comes from a manufacturer page.

5. Optional source fields such as Dept, Class, Fine, or similar classification-oriented columns may be used as evidence when they are present.

However:

- do not blindly concatenate them
- do not assume their hierarchy unless the supplied data supports that relationship
- do not manufacture missing levels around them

6. Manufacturer category or breadcrumb information is manufacturer-owned classification evidence.

It is NOT automatically the final Unilog Classpath.

For example:

manufacturerCategory = "Hammer Drills"

does NOT automatically mean:

"Tools > Power Tools > Drills > Hammer Drills"

CRITICAL CLASSPATH RULES:

- classpath represents a supported Unilog classification path, not merely a plausible general product hierarchy.

- Never construct, expand, infer, or complete classpath using your own taxonomy knowledge.

- Manufacturer productType, manufacturerCategory, breadcrumbs, productName, description, brand, and series may help identify WHAT the product is.

- Those facts do NOT by themselves establish the complete Unilog Classpath.

- Every level appearing in classpath must be supported by the supplied classification evidence.

- Never add broad parents such as:
  "Tools"
  "Power Tools"
  "Electrical"
  "Plumbing"
  "Hardware"
  or any other hierarchy level merely because it seems logically correct.

- Do not transform:

  "Hammer Drills"

  into:

  "Tools > Power Tools > Drills > Hammer Drills"

  unless the supplied evidence explicitly supports that complete path.

- If you know the product type/category confidently but cannot support the complete Classpath, return:

  classpath = null
  confidence = LOW
  needsReview = true

- It is better to return null than to create a plausible but unsupported taxonomy path.

SPECIFICITY RULE:

Your classification must never be more specific than the evidence permits.

If evidence only establishes a broad product type, do not infer a narrower subtype.

If evidence conflicts or is ambiguous, choose the safer result and require review.

CONFIDENCE:

HIGH:
- the returned Classpath itself is strongly and directly supported by supplied classification evidence
- there is little meaningful ambiguity

MEDIUM:
- Classpath has reasonable support
- but some ambiguity or weaker evidence remains

LOW:
- Classpath is weakly supported
- evidence is incomplete/conflicting
- OR classpath is null because no defensible complete path can be established

IMPORTANT:

Confidence refers to confidence in the returned CLASSIFICATION / CLASSPATH.

Do NOT give HIGH confidence merely because the exact product identity is known.

For example:

Exact manufacturer evidence may prove:
"This is a DEWALT DCD799B Hammer Drill."

That does NOT prove:
"Tools > Power Tools > Drills > Hammer Drills"

unless that hierarchy is supplied as classification evidence.

REVIEW RULE:

needsReview must be true when:

- classpath is null
- confidence is LOW
- classification evidence conflicts
- multiple materially different classifications are plausible
- a complete Classpath cannot be supported
- manufacturer evidence identifies the product but does not establish the required classification path

When classpath is null:

- confidence MUST be LOW
- needsReview MUST be true

REASON:

Explain briefly WHY the returned Classpath is supported.

If classpath is null, explain what product identity/category IS supported and what classification evidence is missing.

Do not describe invented taxonomy assumptions.

Return ONLY the required structured classification output.
`;
}




export function buildProposedClassificationPrompt(
  context: ClassificationContext,
): string {
  return `
You are proposing a catalog classification for an industrial commerce product.

IMPORTANT:
This is an INFERRED catalog classification.
It must NOT be presented as an official or validated Unilog taxonomy classification,
because the complete Unilog taxonomy was not provided.

RAW DATA:
${JSON.stringify(context.rawData, null, 2)}

INTERPRETED SOURCE FACTS:
${JSON.stringify(context.interpretation, null, 2)}

VERIFIED MANUFACTURER EVIDENCE:
${JSON.stringify(context.manufacturerEvidence, null, 2)}

GOAL:

Propose:

- dept
- class
- fine
- classpath
- confidence
- reason
- needsReview

PRODUCT FACT RULES:

- Product identity and product facts must come from the supplied evidence.
- Do not invent product specifications.
- Do not invent a different brand, manufacturer, product type, series, or attributes.
- Manufacturer evidence with identityMatch EXACT is the strongest evidence about what the product actually is.
- STRONG evidence may be used with rawData and interpretation.
- WEAK evidence should only be treated as supporting information.
- If manufacturerEvidence is null, use rawData and interpretation.

CLASSIFICATION RULES:

Unlike verified product facts, you ARE allowed to use general industrial-commerce
category knowledge to PROPOSE a reasonable catalog hierarchy.

However:

- The hierarchy is only a proposal.
- Do not claim it is the official Unilog hierarchy.
- Prefer standard, understandable catalog category names.
- Avoid unusual or overly creative taxonomy names.
- Avoid unnecessary hierarchy levels.
- Do not create an extremely specific leaf unless the product evidence supports that specificity.
- Similar product types should naturally receive similar category terminology.

The fields must be internally consistent.

For example, if the product is clearly a Hammer Drill, a reasonable proposal could look like:

dept: "Tools"
class: "Power Tools"
fine: "Hammer Drills"
classpath: "Tools > Power Tools > Drills > Hammer Drills"

This is only an example of structure.
Do NOT copy this classification unless it actually fits the supplied product.

CLASSPATH:

- Build a concise hierarchical path.
- Prefer approximately 3 to 4 meaningful levels.
- Move from broad category to specific product family.
- The final level should closely represent the actual product type/category.
- Do not put brand names, manufacturer names, model numbers, series names,
  voltage, size, or other product attributes into the taxonomy hierarchy.

For example:

GOOD:
Tools > Power Tools > Drills > Hammer Drills

BAD:
DEWALT > ATOMIC > 20V > DCD799B

DEPT / CLASS / FINE:

These are broad catalog grouping fields.

- dept = broad business/product department
- class = major category within that department
- fine = narrower product family

Do not assume that Dept/Class/Fine must be identical to individual Classpath levels.
They should describe the same product placement consistently.

CONFIDENCE:

Confidence means:
"How confident are you that this PROPOSED hierarchy is a reasonable catalog placement?"

It does NOT mean:
"This is confirmed as the official Unilog taxonomy."

HIGH:
- product identity/type is very clear
- proposed category placement is straightforward
- little meaningful category ambiguity exists

MEDIUM:
- proposal is reasonable
- but taxonomy placement could reasonably differ

LOW:
- product identity is unclear
- category evidence is weak
- or multiple substantially different placements are plausible

REVIEW:

needsReview should be true when:

- confidence is LOW
- product identity is ambiguous
- manufacturer evidence conflicts with raw source data
- more than one materially different category placement is plausible
- the product cannot be classified beyond a very broad category

A strong proposed classification may use needsReview = false,
but it is still an inferred classification and not official Unilog taxonomy.

REASON:

Briefly explain which supplied product evidence supports the proposed placement.

Do not claim that the proposed hierarchy came from Unilog.

Return ONLY the required structured output.
`;
}