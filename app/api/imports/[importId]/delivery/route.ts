import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

import { getImportForUser } from "@/server/db/queries/imports";
import { syncImportCompletion } from "@/server/db/queries/import-progress";
import { getProductDeliveryInputsForImport } from "@/server/db/queries/product-delivery";
import { createDeliveryFile } from "@/server/services/product-delivery/create-delivery-file";
import {
  authorizeDeliveryExport,
  parseDeliveryRequest,
  type DeliveryRejection,
} from "@/server/services/product-delivery/delivery-request";

type DeliveryRouteContext = {
  params: Promise<{ importId: string }>;
};

function rejectionResponse(rejection: DeliveryRejection): Response {
  return Response.json(
    { error: rejection.message },
    { status: rejection.status },
  );
}

export async function GET(
  request: NextRequest,
  context: DeliveryRouteContext,
): Promise<Response> {
  const { userId } = await auth();
  const { importId } = await context.params;

  const parsed = parseDeliveryRequest({
    userId,
    importId,
    format: request.nextUrl.searchParams.get("format"),
  });

  if (!parsed.ok) {
    return rejectionResponse(parsed.rejection);
  }

  try {
    const importRecord = await getImportForUser(
      parsed.value.importId,
      parsed.value.userId,
    );

    const progress = importRecord
      ? await syncImportCompletion(importRecord.id)
      : null;

    const refreshedImport = importRecord
      ? await getImportForUser(parsed.value.importId, parsed.value.userId)
      : null;

    const candidate = refreshedImport ?? importRecord;

    const authorized = authorizeDeliveryExport(
      candidate
        ? {
            ...candidate,
            readyCount: progress?.ready ?? 0,
            totalCount: progress?.total ?? 0,
          }
        : null,
      parsed.value.userId,
    );

    if (!authorized.ok) {
      return rejectionResponse(authorized.rejection);
    }

    const inputs = await getProductDeliveryInputsForImport(
      authorized.value.id,
    );

    const file = createDeliveryFile({
      inputs,
      format: parsed.value.format,
      sourceFileName: authorized.value.fileName,
      importId: authorized.value.id,
    });

    return new Response(new Uint8Array(file.body), {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Content-Length": String(file.body.byteLength),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    // Never surface driver or stack details to the caller.
    console.error("Failed to build delivery export", error);

    return rejectionResponse({
      status: 500,
      message: "Could not build the delivery file.",
    });
  }
}
