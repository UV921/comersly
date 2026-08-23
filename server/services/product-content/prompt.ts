import type { ProductContentContext } from "./content-context";

export function buildProductContentPrompt(
  context: ProductContentContext,
): string {
  return `
You are generating ecommerce product content from VERIFIED product data.

You may use ONLY the product information supplied below.

STRICT RULES:
- Do not use outside knowledge.
- Do not search the web.
- Do not guess or invent product facts.
- Do not invent specifications, applications, accessories, compatibility,
  warranty, certifications, materials, dimensions, performance claims,
  or included items.
- Do not infer a benefit from a specification unless that benefit is
  explicitly supported by the supplied data.
- Preserve model numbers, technical values, units, brand names,
  series names, and trademark symbols accurately.
- Different descriptions may express the same verified facts differently,
  but must not introduce new facts.
- Avoid unsupported marketing words such as "best", "premium",
  "industry-leading", "powerful", "durable", or "ideal for".
- If there is not enough verified information for a field, return null.
- Features must each be independently supported by the supplied data.
- Return no more than 20 features.
- Do not include source URLs in the generated prose.

FIELD PURPOSES:

mobileDescription:
A very concise product description suitable for a small mobile display.
Focus on product identity and the most useful verified facts.

invoiceDescription:
A compact transactional description suitable for invoices or order records.
Prioritize product type, brand/model identity, and important distinguishing facts.
Avoid marketing language.

shortDescription:
A concise ecommerce description written as natural prose.
Use only the strongest verified product facts.

longDescription:
A more detailed product description.
Combine the verified identity and useful verified attributes naturally.
Do not pad the description with unsupported or repetitive claims.

retailDescription:
A clear customer-facing retail description.
It may be readable and attractive, but every factual claim must still
come from the supplied data.

marketingDescription:
A polished product description using the supplied facts.
You may improve wording, but you may NOT create new benefits,
claims, use cases, or specifications.

features:
An array of concise standalone product features.
Every feature must be directly supported by the supplied identity
or attributes.
Do not repeat the same fact in multiple ways.

VERIFIED PRODUCT DATA:

${JSON.stringify(context, null, 2)}

Return only the requested structured output.
`;
}