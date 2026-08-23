import { createImport } from "@/server/db/queries/import";
import { auth } from "@clerk/nextjs/server";
import  {parseSpreadsheet}  from "@/server/services/spreadsheet-parser";
import { uploadFile } from "@/server/services/file-storage";
import { createIngestedItems } from "@/server/db/queries/ingested-items";
import { inngest } from "@/server/inngest/client";
import { INGESTIIN_ITEM_READY_EVENT } from "@/shared/contracts/ingestion-event";

export async function POST(request: Request) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const data = await request.formData();

  const file = data.get("file");


  if (!file || typeof file === "string") {
    return Response.json(
      { error: "File not received" },
      { status: 400 }
    );
  }

  
  console.log("Received file:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });



  const fileName = file.name.toLowerCase();

const isValidType =
  fileName.endsWith(".csv") ||
  fileName.endsWith(".xlsx");

if (!isValidType) {
  return Response.json(
    { error: "Only CSV and XLSX files are allowed" },
    { status: 400 }
  );
}

if (file.size === 0) {
  return Response.json(
    { error: "File is empty" },
    { status: 400 }
  );
}


const sourceFormat = fileName.endsWith(".csv")
  ? "CSV"
  : "XLSX";

//   const storageKey = await uploadFile(file, userId);
const normalizedRows = await parseSpreadsheet(file, sourceFormat);

const storageKey = await uploadFile(file, userId);

const createdImport = await createImport({
  clerkUserId: userId,
  fileName: file.name,
  sourceFormat,
  storageKey,
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


  return Response.json({
    message: "File received successfully",
    userId,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
    sourceFormat,
    storageKey,
     importId: createdImport.id,
ingestedItemIds: ingestedItems.map((item) => item.id),
rowCount: ingestedItems.length,
  });

}