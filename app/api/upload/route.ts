import { auth } from "@clerk/nextjs/server";

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


  return Response.json({
    message: "File received successfully",
    userId,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
    sourceFormat
  });

}