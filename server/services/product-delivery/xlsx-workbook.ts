import { createZipArchive } from "./zip";

/*
 * Writes a single-sheet .xlsx workbook containing a flat grid of strings.
 *
 * Values are stored as inline strings, so there is no shared string table to
 * keep in sync and every cell is self-describing. Blank cells are omitted and
 * the sheet dimension declares the full grid, which is how Excel itself writes
 * sparse sheets.
 */

// XML 1.0 forbids most C0 control characters outside tab, newline and return.
const ILLEGAL_XML_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

function escapeXml(value: string): string {
  return (
    value
      .replaceAll(ILLEGAL_XML_CHARACTERS, "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      // XML parsers normalise a literal carriage return to a line feed, which
      // would quietly rewrite CRLF text on the way into Excel. A character
      // reference survives that normalisation.
      .replaceAll("\r", "&#13;")
  );
}

export function toColumnName(columnIndex: number): string {
  let remaining = columnIndex + 1;
  let name = "";

  while (remaining > 0) {
    const remainder = (remaining - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    remaining = Math.floor((remaining - remainder) / 26);
  }

  return name;
}

function renderCell(value: string, columnIndex: number, rowNumber: number): string {
  const reference = `${toColumnName(columnIndex)}${rowNumber}`;

  if (value === "") {
    return `<c r="${reference}"/>`;
  }

  return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function renderSheet(rows: readonly (readonly string[])[]): string {
  const columnCount = rows.reduce((widest, row) => Math.max(widest, row.length), 0);

  const dimension =
    rows.length > 0 && columnCount > 0
      ? `<dimension ref="A1:${toColumnName(columnCount - 1)}${rows.length}"/>`
      : "";

  const body = rows
    .map((cells, rowIndex) => {
      const rowNumber = rowIndex + 1;

      const renderedCells = cells
        .map((value, columnIndex) => renderCell(value, columnIndex, rowNumber))
        .join("");

      return `<row r="${rowNumber}" spans="1:${columnCount}">${renderedCells}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${dimension}<sheetData>${body}</sheetData></worksheet>`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;

const ROOT_RELATIONSHIPS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

const WORKBOOK_RELATIONSHIPS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;

// Excel rejects sheet names longer than 31 characters or containing : \ / ? * [ ]
const INVALID_SHEET_NAME_CHARACTERS = /[:\\/?*[\]]/;

export type XlsxWorkbook = {
  sheetName: string;
  rows: readonly (readonly string[])[];
};

export function createXlsxWorkbook(workbook: XlsxWorkbook): Buffer {
  const { sheetName, rows } = workbook;

  if (sheetName.length === 0 || sheetName.length > 31) {
    throw new Error(`Invalid worksheet name: "${sheetName}"`);
  }

  if (INVALID_SHEET_NAME_CHARACTERS.test(sheetName)) {
    throw new Error(`Invalid worksheet name: "${sheetName}"`);
  }

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  return createZipArchive([
    { path: "[Content_Types].xml", contents: CONTENT_TYPES },
    { path: "_rels/.rels", contents: ROOT_RELATIONSHIPS },
    { path: "xl/workbook.xml", contents: workbookXml },
    { path: "xl/_rels/workbook.xml.rels", contents: WORKBOOK_RELATIONSHIPS },
    { path: "xl/worksheets/sheet1.xml", contents: renderSheet(rows) },
  ]);
}
