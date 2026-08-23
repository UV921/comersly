import { toCell } from "./cell-value";
import type { ProductDeliveryCells, ProductDeliveryInput } from "./types";

/*
 * The pipeline keeps two distinct classification concepts and delivery
 * preserves that separation instead of inventing a third hierarchy:
 *
 *   verifiedClassification  - only ever carries a classpath, and only when the
 *                             evidence supported it.
 *   proposedClassification  - carries the Dept / Class / Fine breakdown plus a
 *                             proposed classpath.
 *
 * Classpath prefers the verified value and falls back to the proposed one, so a
 * proposal is published only where nothing was verified. Dept / Class / Fine
 * can only come from the proposal because the verified shape has no such
 * fields; they are never derived by splitting a classpath.
 */
export function mapClassification(
  input: Pick<
    ProductDeliveryInput,
    "verifiedClassification" | "proposedClassification"
  >,
): ProductDeliveryCells {
  const verified = input.verifiedClassification;
  const proposed = input.proposedClassification;

  const classpath = verified?.classpath ?? proposed?.classpath ?? null;

  return {
    Classpath: toCell(classpath),
    Dept: toCell(proposed?.dept),
    Class: toCell(proposed?.class),
    Fine: toCell(proposed?.fine),
  };
}
