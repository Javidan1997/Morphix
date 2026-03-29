const TEMPLATE_HEADERS = ["locale", "page", "section", "path", "type", "value"];
const EXCLUDED_KEYS = new Set(["assetId", "type", "size", "layout"]);

function isPrimitive(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function escapeCsvCell(value) {
  const stringValue = value === null || value === undefined ? "" : String(value);
  return `"${stringValue.replace(/"/g, "\"\"")}"`;
}

function parseCsvRow(line) {
  const cells = [];
  let current = "";
  let index = 0;
  let isQuoted = false;

  while (index < line.length) {
    const char = line[index];

    if (isQuoted) {
      if (char === "\"") {
        if (line[index + 1] === "\"") {
          current += "\"";
          index += 2;
          continue;
        }

        isQuoted = false;
        index += 1;
        continue;
      }

      current += char;
      index += 1;
      continue;
    }

    if (char === "\"") {
      isQuoted = true;
      index += 1;
      continue;
    }

    if (char === ",") {
      cells.push(current);
      current = "";
      index += 1;
      continue;
    }

    current += char;
    index += 1;
  }

  cells.push(current);
  return cells;
}

function flattenValue(rows, { localeCode, pageId, sectionKey, value, path = [] }) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenValue(rows, {
        localeCode,
        pageId,
        sectionKey,
        value: item,
        path: [...path, index],
      });
    });
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, childValue]) => {
      if (EXCLUDED_KEYS.has(key)) return;

      flattenValue(rows, {
        localeCode,
        pageId,
        sectionKey,
        value: childValue,
        path: [...path, key],
      });
    });
    return;
  }

  if (!isPrimitive(value)) return;

  rows.push({
    locale: localeCode,
    page: pageId,
    section: sectionKey,
    path: path.join("."),
    type: typeof value,
    value: String(value),
  });
}

export function buildContentTemplateRows({ localeCode, sections, resolvePageId }) {
  const rows = [];

  sections.forEach(({ key, value }) => {
    flattenValue(rows, {
      localeCode,
      pageId: resolvePageId(key),
      sectionKey: key,
      value,
    });
  });

  return rows;
}

export function buildContentTemplateCsv(rows) {
  const lines = [
    TEMPLATE_HEADERS.map((header) => escapeCsvCell(header)).join(","),
    ...rows.map((row) => TEMPLATE_HEADERS.map((header) => escapeCsvCell(row[header])).join(",")),
  ];

  return `\uFEFF${lines.join("\n")}`;
}

export function parseContentTemplateCsv(text) {
  const normalizedText = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (!normalizedText) {
    return [];
  }

  const lines = normalizedText.split("\n").filter(Boolean);
  if (!lines.length) return [];

  const [headerLine, ...dataLines] = lines;
  const headers = parseCsvRow(headerLine).map((cell) => cell.trim());
  const isValidHeader = TEMPLATE_HEADERS.every((header, index) => headers[index] === header);

  if (!isValidHeader) {
    throw new Error("The uploaded file does not match the Morphix content template format.");
  }

  return dataLines
    .map((line) => parseCsvRow(line))
    .filter((cells) => cells.some((cell) => cell !== ""))
    .map((cells) => Object.fromEntries(
      TEMPLATE_HEADERS.map((header, index) => [header, cells[index] ?? ""]),
    ));
}

export function coerceTemplateValue(type, value) {
  if (type === "boolean") {
    const normalized = String(value).trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "0" || normalized === "no" || normalized === "") return false;
    throw new Error(`Invalid boolean value: ${value}`);
  }

  if (type === "number") {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid number value: ${value}`);
    }
    return parsed;
  }

  return value;
}

export function parseTemplatePath(path) {
  return String(path)
    .split(".")
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}
