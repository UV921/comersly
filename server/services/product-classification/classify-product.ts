import { ClassificationContext } from "./classification-context";
import { ProductClassification, productClassificationSchema } from "./schema";
import { ai } from "@/server/ai/client";
import { buildClassificationPrompt } from "./prompt";
import {z} from "zod"

export async function classifyProduct(
    context: ClassificationContext,
  ): Promise<ProductClassification> {
    const input=buildClassificationPrompt(context)
    const response= await ai.interactions.create({
        model:"gemini-3.7-flash",
        input:input,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: z.toJSONSchema(productClassificationSchema),
          },
    })
    if(!response.output_text){
        throw new Error("No response by gemini during classfication")


    }
    
    const parsed = JSON.parse(response.output_text);

const classification =
  productClassificationSchema.parse(parsed);

return classification;
    
  }