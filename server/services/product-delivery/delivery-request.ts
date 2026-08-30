import { z } from "zod";

import type { ImportStatus } from "@/shared/contracts/ingestion";

import { deliveryFormatSchema, type DeliveryFormat } from "./delivery-format";
import { canDownloadDelivery } from "./export-readiness";

export type DeliveryRejection = {
  status: number;
  message: string;
};

export type DeliveryRequest = {
  userId: string;
  importId: string;
  format: DeliveryFormat;
};

export type DeliveryDecision<T> =
  | { ok: true; value: T }
  | { ok: false; rejection: DeliveryRejection };

export type DeliveryRequestInput = {
  userId: string | null;
  importId: string;
  format: string | null;
};

/*
 * Validates the shape of an export request before any data is touched.
 *
 * A malformed import id is answered as "not found" rather than "bad request" so
 * the endpoint responds identically whether an id is invalid, absent or simply
 * not the caller's.
 */
export function parseDeliveryRequest(
  input: DeliveryRequestInput,
): DeliveryDecision<DeliveryRequest> {
  if (!input.userId) {
    return {
      ok: false,
      rejection: { status: 401, message: "Authentication required." },
    };
  }

  const format = deliveryFormatSchema.safeParse(input.format);

  if (!format.success) {
    return {
      ok: false,
      rejection: {
        status: 400,
        message: "Unsupported delivery format. Use format=csv or format=xlsx.",
      },
    };
  }

  if (!z.uuid().safeParse(input.importId).success) {
    return {
      ok: false,
      rejection: { status: 404, message: "Import not found." },
    };
  }

  return {
    ok: true,
    value: {
      userId: input.userId,
      importId: input.importId,
      format: format.data,
    },
  };
}

export type ExportableImport = {
  clerkUserId: string;
  status: ImportStatus;
  readyCount?: number;
  totalCount?: number;
};

/*
 * Decides whether the signed-in user may download this import.
 *
 * Ownership is re-checked here even though the lookup already filters by user
 * id, so a future caller that loads an import some other way still cannot hand
 * it to a different user. A foreign import is reported as missing so the
 * endpoint never confirms that somebody else's import id exists.
 */
export function authorizeDeliveryExport<TImport extends ExportableImport>(
  importRecord: TImport | null,
  userId: string,
): DeliveryDecision<TImport> {
  if (!importRecord || importRecord.clerkUserId !== userId) {
    return {
      ok: false,
      rejection: { status: 404, message: "Import not found." },
    };
  }

  if (
    !canDownloadDelivery({
      status: importRecord.status,
      readyCount: importRecord.readyCount ?? 0,
      totalCount: importRecord.totalCount ?? 0,
    })
  ) {
    return {
      ok: false,
      rejection: {
        status: 409,
        message:
          "This import is still processing. The delivery file is available once processing has finished.",
      },
    };
  }

  return { ok: true, value: importRecord };
}
