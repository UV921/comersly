
import { InterpretedAttribute } from "./schema";

const KNOWN_MISSING_VALUES = new Set([
  "-- Unbranded --",
  "-- No Unilog Brand --",
  "-- No DIB Brand --",
]);

export function isUsableField(value: unknown) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    let cleanedValue = value.trim();
    if (cleanedValue.length === 0) return false;
    cleanedValue = cleanedValue.toUpperCase();
    if (KNOWN_MISSING_VALUES.has(cleanedValue)) return false;
    else {
      return true;
    }
  }

  return true;
}

export function prepareUsableRawData(rawData: Record<string, unknown>) {
  const rawArray = Object.entries(rawData);
  const usableArray = rawArray.filter(([key, value]) => isUsableField(value));
  const usableRawData = Object.fromEntries(usableArray);
  return usableRawData;
}

export const DIRECT_SOURCE_FIELDS = {
  manufacturerPartNumber: ["Mfg_Part_Num"],
  manufacturerCandidates: ["Part_Manuf"],
  brandCandidates: ["E1_Brand", "Unilog_Brand", "DIB_Brand"],
} as const;
const DIRECT_FIELD = new Set<string>(
  Object.values(DIRECT_SOURCE_FIELDS).flat(),
);

export function prepareSemanticInput(useableRawData: Record<string, unknown>) {
  const rawArray = Object.entries(useableRawData);
  const useableArray = rawArray.filter(
    ([key, value]) => !DIRECT_FIELD.has(key),
  );
  const SemanticInput = Object.fromEntries(useableArray);
  return SemanticInput;
}
export function validateAttributeSourceColumns(semanticInput:Record<string, unknown>,attributes:InterpretedAttribute[]){
const keys=new Set<string>(
    Object.keys(semanticInput)
)
 attributes.forEach(attribute=>{
    if(!keys.has(attribute.sourceColumn)){
        throw new Error( `Invalid sourceColumn "${attribute.sourceColumn}"`,)
    }
    
    

 })

 return attributes;

   

}
