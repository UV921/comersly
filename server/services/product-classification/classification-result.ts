import { z } from "zod";

import { manufacturerClassificationEvidenceSchema } from "./manufacturer-evidence";
import { productClassificationSchema } from "./schema";
import { proposedClassificationSchema } from "./schema";

export const classificationResultSchema = z.strictObject({
  manufacturerEvidence:
    manufacturerClassificationEvidenceSchema.nullable(),

  verifiedClassification:
    productClassificationSchema,

  proposedClassification:
    proposedClassificationSchema,
});

export type ClassificationResult =
  z.infer<typeof classificationResultSchema>;