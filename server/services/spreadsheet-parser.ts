import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import readExcelFile from "read-excel-file/node";
import type {
  SourceFormat,
  SourceRawData,
  SourceMetadata,
  JsonValue,
} from "@/shared/contracts/ingestion";

function toJsonValue(value: unknown): JsonValue {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(toJsonValue);
  }

  if (typeof value === "object") {
    return JSON.parse(JSON.stringify(value)) as JsonValue;
  }

  return String(value);
}

export async function parseSpreadsheet(
  file: File,
  sourceFormat: SourceFormat
) {
  const workbook = new ExcelJS.Workbook();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // CSV
 // CSV
if (sourceFormat === "CSV") {
  const stream = Readable.from(buffer);

  const worksheet = await workbook.csv.read(stream);

  const headerValues = worksheet.getRow(1).values;

  if (!Array.isArray(headerValues)) {
    throw new Error("CSV has no valid header row");
  }

  // ExcelJS row.values is 1-based, so remove first empty position
  const headers = headerValues
    .slice(1)
    .map((header) => String(header));

const normalizedRows: Array<{
  rawData: SourceRawData;
  sourceMetadata: SourceMetadata;
}> = [];

  worksheet.eachRow((row, rowNumber) => {
    // Skip header
    if (rowNumber === 1) return;

    const rowValues = Array.isArray(row.values)
      ? row.values.slice(1)
      : [];

    const rawData = Object.fromEntries(
      headers.map((header, index) => [
        header,
toJsonValue(rowValues[index])   ,   ])
    );

    normalizedRows.push({
      rawData,
      sourceMetadata: {
        fileName: file.name,
        sheetName: null,
        rowNumber,
      },
    });
  });

  console.log("Normalized CSV rows:", normalizedRows);

  return normalizedRows;
}

// XLSX
if (sourceFormat === "XLSX") {
  const sheets = await readExcelFile(buffer);

  console.log(
    "XLSX sheets:",
    sheets.map((sheet) => sheet.sheet)
  );

  console.log(
    "First XLSX row:",
    sheets[0]?.data[1]
  );
const headers = sheets[0]?.data[0];
const firstDataRow = sheets[0]?.data[1];

if (!headers || !firstDataRow) {
  throw new Error("Spreadsheet has no data rows");
}

const rawData = Object.fromEntries(
  headers.map((header, index) => [
    String(header),
    firstDataRow[index] ?? null,
  ])
);

console.log("Raw data:", rawData);

//
if (sourceFormat === "XLSX") {
  const sheets = await readExcelFile(buffer);

  const firstSheet = sheets[0];

  if (!firstSheet || firstSheet.data.length < 2) {
    throw new Error("Spreadsheet has no data rows");
  }

  const headers = firstSheet.data[0].map((header) =>
    String(header)
  );

  const normalizedRows = firstSheet.data
    .slice(1)
    .map((row, index) => {
      const rawData = Object.fromEntries(
        headers.map((header, columnIndex) => [
          header,
          row[columnIndex] ?? null,
        ])
      );

      return {
        rawData,
        sourceMetadata: {
          fileName: file.name,
          sheetName: firstSheet.sheet,
          rowNumber: index + 2,
        },
      };
    });

  console.log("Normalized XLSX rows:", normalizedRows);

  return normalizedRows;
}

  return sheets;
}}