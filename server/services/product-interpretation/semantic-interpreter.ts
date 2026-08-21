import { ai } from "../../ai/client";
import { z} from "zod"
import { interpretedAttributeSchema } from "./schema";
import { buildSemanticInterpretationPrompt } from "./prompt";
import { validateAttributeSourceColumns } from "./helper";



//schema accoridng zod

export const semanticAttributesSchema =z.array(interpretedAttributeSchema)
const jsonSemanticAttributesSchema=z.toJSONSchema(semanticAttributesSchema)

export async function createSemanticOutput(semanticInput:Record<string,unknown>){
   const promt= buildSemanticInterpretationPrompt(semanticInput)
    const response=await ai.interactions.create({
        model:"gemini-3.5-flash-lite",
        input:promt
        ,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: jsonSemanticAttributesSchema
          },
    })
    if(!response.output_text){
        throw new Error("something went wrong")
    }
    const rawResult=JSON.parse(response.output_text)
    const result=semanticAttributesSchema.parse(rawResult)
    const validatedResult=validateAttributeSourceColumns(semanticInput,result)
    return validatedResult;
    



   

    

}