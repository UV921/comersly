import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import type {
  SourceFormat,
  SourceRawData,
  SourceMetadata,
  JsonValue,
} from "@/shared/contracts/ingestion";

type NormalizedRow = {
  rawData: SourceRawData;
  sourceMetadata: SourceMetadata;
};

function unwrapCellValue(value: ExcelJS.CellValue | undefined): unknown {
  if (value == null) {
    return null;
  }

  if (typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if ("richText" in value) {
    return value.richText.map((entry) => entry.text).join("");
  }

  if ("text" in value && typeof value.text === "string") {
    return value.text;
  }

  if ("result" in value) {
    return value.result ?? null;
  }

  return value;
}

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

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === "";
}

function getHeaders(worksheet: ExcelJS.Worksheet): string[] {
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  for (let column = 1; column <= headerRow.cellCount; column += 1) {
    const header = String(
      unwrapCellValue(headerRow.getCell(column).value) ?? "",
    ).trim();
    headers.push(header);
  }

  return headers;
}

function worksheetToRows(
  worksheet: ExcelJS.Worksheet,
  fileName: string,
  sheetName: string | null,
): NormalizedRow[] {
  const headers = getHeaders(worksheet);

  if (headers.every((header) => header === "")) {
    return [];
  }

  const rows: NormalizedRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const rowValues = headers.map((_, index) =>
      unwrapCellValue(row.getCell(index + 1).value),
    );

    if (rowValues.every(isEmptyValue)) {
      return;
    }

    const rawData = Object.fromEntries(
      headers.flatMap((header, index) =>
        header ? [[header, toJsonValue(rowValues[index])]] : [],
      ),
    );

    rows.push({
      rawData,
      sourceMetadata: {
        fileName,
        sheetName,
        rowNumber,
      },
    });
  });

  return rows;
}

async function loadWorksheets(
  file: File,
  sourceFormat: SourceFormat,
): Promise<Array<{ sheetName: string | null; worksheet: ExcelJS.Worksheet }>> {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();

  if (sourceFormat === "CSV") {
    const worksheet = await workbook.csv.read(
      Readable.from(new Uint8Array(arrayBuffer)),
    );
    return [{ sheetName: null, worksheet }];
  }

  await workbook.xlsx.load(arrayBuffer);

  return workbook.worksheets.map((worksheet) => ({
    sheetName: worksheet.name,
    worksheet,
  }));
}

export async function parseSpreadsheet(
  file: File,
  sourceFormat: SourceFormat,
): Promise<NormalizedRow[]> {
  const sheets = await loadWorksheets(file, sourceFormat);
  const normalizedRows: NormalizedRow[] = [];

  for (const { sheetName, worksheet } of sheets) {
    normalizedRows.push(
      ...worksheetToRows(worksheet, file.name, sheetName),
    );
  }

  return normalizedRows;
}
