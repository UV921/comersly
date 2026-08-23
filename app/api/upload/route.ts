import { auth } from "@clerk/nextjs/server";
import { createImport } from "@/server/db/queries/import";
import { markImportProcessing } from "@/server/db/queries/import-progress";
import { createIngestedItems } from "@/server/db/queries/ingested-items";
import { inngest } from "@/server/inngest/client";
import { uploadFile } from "@/server/services/file-storage";
import { parseSpreadsheet } from "@/server/services/spreadsheet-parser";
import { INGESTIIN_ITEM_READY_EVENT } from "@/shared/contracts/ingestion-event";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.formData();
  const file = data.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "File not received" }, { status: 400 });
  }

  const fileName = file.name.toLowerCase();
  const isValidType =
    fileName.endsWith(".csv") || fileName.endsWith(".xlsx");

  if (!isValidType) {
    return Response.json(
      { error: "Only CSV and XLSX files are allowed" },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return Response.json({ error: "File is empty" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return Response.json(
      { error: "File must be 10MB or smaller" },
      { status: 400 },
    );
  }

  const sourceFormat = fileName.endsWith(".csv") ? "CSV" : "XLSX";

  try {
    const normalizedRows = await parseSpreadsheet(file, sourceFormat);

    if (normalizedRows.length === 0) {
      return Response.json(
        { error: "Spreadsheet has no data rows" },
        { status: 400 },
      );
    }

    const storageKey = await uploadFile(file, userId);
    const createdImport = await createImport({
      clerkUserId: userId,
      fileName: file.name,
      sourceFormat,
      storageKey,
      totalRows: normalizedRows.length,
    });
    const ingestedItems = await createIngestedItems({
      importId: createdImport.id,
      sourceFormat,
      rows: normalizedRows,
    });

    await inngest.send(
      ingestedItems.map((item) => ({
        name: INGESTIIN_ITEM_READY_EVENT,
        data: {
          itemId: item.id,
        },
      })),
    );

    await markImportProcessing(createdImport.id);

    return Response.json({
      message: "File received successfully",
      importId: createdImport.id,
      sourceFormat,
      storageKey,
      ingestedItemIds: ingestedItems.map((item) => item.id),
      rowCount: ingestedItems.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process upload";

    return Response.json({ error: message }, { status: 500 });
  }
}
