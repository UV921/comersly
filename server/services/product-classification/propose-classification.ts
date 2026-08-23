import {z} from "zod"
import type { ClassificationContext } from "./classification-context";
import {type ProposedClassification, proposedClassificationSchema } from "./schema";
import { ai } from "@/server/ai/client";
import { buildProposedClassificationPrompt } from "./prompt";

export async function proposeClassification(
    context: ClassificationContext,
  ): Promise<ProposedClassification> {
    const input=buildProposedClassificationPrompt(context)
    const result=await ai.interactions.create({
        model:"gemini-3.7-flash",
        input:input,
        response_format:{
            type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(proposedClassificationSchema),
            
        }

    

    })
    if(!result.output_text){
        throw new Error("NO getting response for perposed classifciation")
    }
    const parsed=JSON.parse(result.output_text)
    const validatedResult=proposedClassificationSchema.parse(parsed)
    return validatedResult


  }