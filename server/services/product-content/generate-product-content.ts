import { z } from "zod";

import { ai } from "@/server/ai/client";

import type { ProductContentContext } from "./content-context";
import { buildProductContentPrompt } from "./prompt";
import {
  productContentSchema,
  type ProductContent,
} from "./schema";

export async function generateProductContent(
  context: ProductContentContext,
): Promise<ProductContent> {
  const hasIdentity = Object.values(context.identity).some(
    (value) => value !== null,
  );

  if (!hasIdentity && context.attributes.length === 0) {
    return productContentSchema.parse({
      mobileDescription: null,
      invoiceDescription: null,
      shortDescription: null,
      longDescription: null,
      retailDescription: null,
      marketingDescription: null,
      features: [],
    });
  }

  const prompt = buildProductContentPrompt(context);

  const result = await ai.interactions.create({
    model: "gemini-3.7-flash",

    input: prompt,

    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(productContentSchema),
    },
  });

  if (!result.output_text) {
    throw new Error(
      "Gemini returned empty product content output",
    );
  }

  const parsed: unknown = JSON.parse(
    result.output_text,
  );

  return productContentSchema.parse(parsed);
}