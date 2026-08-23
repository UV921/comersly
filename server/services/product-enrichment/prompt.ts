import type { ManufacturerClassificationEvidence } from "../product-classification/manufacturer-evidence";

export function buildProductEnrichmentPrompt(
  manufacturerEvidence: ManufacturerClassificationEvidence,
): string {
    return `
    You are extracting structured product specifications from ONE verified manufacturer-owned product page.
    
    VERIFIED PRODUCT CONTEXT:
    ${JSON.stringify(manufacturerEvidence, null, 2)}
    
    SOURCE PAGE:
    ${manufacturerEvidence.sourceUrl}
    
    GOAL:
    
    Read ONLY the supplied manufacturer page and extract useful, explicit product specifications.
    
    Return attributes with:
    
    - name
    - value
    - uom
    
    RULES:
    
    1. Use ONLY information explicitly supported by the manufacturer page.
    
    2. Do NOT:
       - use outside knowledge
       - use model memory
       - search the web for additional facts
       - guess missing specifications
       - infer values that are not stated
       - copy values only because they appear in VERIFIED PRODUCT CONTEXT
    
    3. VERIFIED PRODUCT CONTEXT is provided only to help identify the correct product.
       It is NOT additional evidence for attribute values.
    
    4. Extract useful technical/product specifications such as:
       - dimensions
       - voltage
       - amperage
       - speed
       - capacity
       - weight
       - material
       - color
       - mounting
       - performance ratings
       - sizes
       - product-specific technical properties
    
       Only extract fields actually present on the page.
    
    5. Do not force a predefined attribute list.
       Different product categories naturally have different attributes.
    
    6. Preserve the manufacturer's meaning.
    
    Example:
    
    Manufacturer page:
    "No Load Speed: 0-1650 RPM"
    
    Return:
    {
      "name": "No Load Speed",
      "value": "0-1650",
      "uom": "RPM"
    }
    
    7. Separate a measurement value from its unit when the separation is clear.
    
    Examples:
    
    "20 V"
    → value: "20"
    → uom: "V"
    
    "1/2 in"
    → value: "1/2"
    → uom: "in"
    
    "47 dBA"
    → value: "47"
    → uom: "dBA"
    
    8. When a field has no measurement unit, use:
    
    uom: null
    
    Example:
    
    "Color: Yellow"
    → value: "Yellow"
    → uom: null
    
    9. Preserve ranges and compound values.
    
    Example:
    
    "0-1650 RPM"
    → value: "0-1650"
    → uom: "RPM"
    
    Do NOT reduce it to only "1650".
    
    10. Do not invent or aggressively normalize manufacturer terminology.
    
    11. Do not return:
       - brand
       - manufacturer
       - manufacturer part number
       - product name
       - product type
       - category
       - series
    
    Those identity fields are already handled by the classification/manufacturer-evidence stage.
    
    12. Do not return marketing sentences, navigation text, breadcrumbs,
    cookie text, warranty boilerplate, or unrelated page content as attributes.
    
    13. If the page provides no useful explicit specifications, return:
    
    {
      "attributes": []
    }
    
    Return ONLY the required structured JSON output.
    `;
    }
