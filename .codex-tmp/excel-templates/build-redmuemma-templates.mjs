import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:/workspace/redcatlog_frontend/outputs/redmuemma-excel-templates";

const colors = {
  purple: "#7044C9",
  darkPurple: "#3A2467",
  pink: "#FF88AC",
  peach: "#FBAB8E",
  lavender: "#F7EDFF",
  softPink: "#FFF4F0",
  ink: "#211734",
  muted: "#6D6383",
  border: "#EDE7F3",
  required: "#FFF1F2",
  optional: "#F8FAFC",
};

const entrepreneurColumns = [
  ["firstName", "Obligatorio", "Nombres", "Texto. Minimo 2 caracteres.", "Maria"],
  ["lastName", "Obligatorio", "Apellidos", "Texto. Minimo 2 caracteres.", "Perez"],
  ["fullName", "Opcional", "Nombre completo visible", "Si se deja vacio, el sistema puede construirlo con nombres y apellidos.", "Maria Perez"],
  ["slug", "Obligatorio", "Slug publico", "Minusculas, numeros y guiones. Ej: maria-perez.", "maria-perez"],
  ["categoryId", "Opcional", "ID categoria", "ID de categoria de emprendedora si ya existe en el sistema.", ""],
  ["documentType", "Opcional", "Tipo documento", "CC, CE, NIT, Pasaporte u otro.", "CC"],
  ["documentNumber", "Opcional", "Numero documento", "Numero de identificacion.", "1234567890"],
  ["shortBio", "Opcional", "Bio corta", "Resumen corto para tarjetas publicas.", "Artesana de los Montes de Maria."],
  ["bio", "Opcional", "Biografia", "Descripcion amplia del perfil.", "Texto descriptivo de la emprendedora."],
  ["personalStory", "Opcional", "Historia personal", "Historia o relato para el perfil publico.", "Historia de vida y emprendimiento."],
  ["locationText", "Opcional", "Texto ubicacion", "Texto libre de ubicacion.", "San Jacinto, Bolivar"],
  ["photoFileName", "Opcional", "Archivo foto perfil", "Nombre del archivo de imagen entregado al equipo. JPG, PNG o WEBP.", "maria-perfil.jpg"],
  ["bannerFileName", "Opcional", "Archivo banner", "Nombre del archivo de banner entregado al equipo. JPG, PNG o WEBP.", "maria-banner.jpg"],
  ["email", "Opcional", "Correo", "Correo valido.", "maria@example.com"],
  ["phone", "Opcional", "Telefono", "Telefono de contacto.", "3000000000"],
  ["whatsapp", "Opcional", "WhatsApp", "Numero de WhatsApp.", "3000000000"],
  ["city", "Opcional", "Ciudad", "Municipio o ciudad.", "San Jacinto"],
  ["department", "Opcional", "Departamento", "Departamento.", "Bolivar"],
  ["country", "Opcional", "Pais", "Por defecto Colombia.", "Colombia"],
  ["facebookUrl", "Opcional", "Facebook", "URL completa si aplica.", "https://facebook.com/marca"],
  ["instagramUrl", "Opcional", "Instagram", "URL completa si aplica.", "https://instagram.com/marca"],
  ["tiktokUrl", "Opcional", "TikTok", "URL completa si aplica.", "https://tiktok.com/@marca"],
  ["youtubeUrl", "Opcional", "YouTube", "URL completa si aplica.", "https://youtube.com/@marca"],
  ["websiteUrl", "Opcional", "Sitio web", "URL completa si aplica.", "https://marca.com"],
  ["status", "Opcional", "Estado inicial", "draft, pending_review, approved, rejected, inactive o active.", "pending_review"],
  ["observations", "Opcional", "Observaciones internas", "Notas para el equipo administrador. No se envia al backend.", ""],
];

const productColumns = [
  ["entrepreneurId", "Obligatorio", "ID emprendedora", "ID de la emprendedora aprobada en el sistema.", "ent_001"],
  ["entrepreneurSlug", "Apoyo", "Slug emprendedora", "Dato de apoyo para identificar a la emprendedora. No reemplaza el ID.", "maria-perez"],
  ["name", "Obligatorio", "Nombre producto", "Texto. Minimo 3 caracteres.", "Bolso tejido artesanal"],
  ["slug", "Obligatorio", "Slug producto", "Minusculas, numeros y guiones. Ej: bolso-tejido-artesanal.", "bolso-tejido-artesanal"],
  ["categoryId", "Opcional", "ID categoria", "ID de categoria de producto si ya existe en el sistema.", ""],
  ["shortDescription", "Opcional", "Descripcion corta", "Maximo 500 caracteres.", "Bolso tejido a mano."],
  ["description", "Opcional", "Descripcion completa", "Descripcion amplia del producto.", "Bolso artesanal tejido por mujeres de la red."],
  ["hasPrice", "Obligatorio", "Tiene precio", "SI o NO.", "SI"],
  ["price", "Condicional", "Precio", "Requerido si Tiene precio = SI. Solo numeros.", 85000],
  ["managesStock", "Obligatorio", "Maneja inventario", "SI o NO.", "SI"],
  ["stock", "Condicional", "Stock", "Requerido si Maneja inventario = SI. Numero entero.", 10],
  ["image1FileName", "Opcional", "Imagen 1", "Nombre de archivo. JPG, PNG o WEBP. Sera imagen principal.", "bolso-1.jpg"],
  ["image2FileName", "Opcional", "Imagen 2", "Nombre de archivo. JPG, PNG o WEBP.", "bolso-2.jpg"],
  ["image3FileName", "Opcional", "Imagen 3", "Nombre de archivo. JPG, PNG o WEBP.", "bolso-3.jpg"],
  ["imageAltText", "Opcional", "Texto alternativo imagenes", "Descripcion breve para accesibilidad.", "Bolso tejido artesanal colorido"],
  ["status", "Opcional", "Estado inicial", "draft, pending_review, approved, published, rejected, inactive o archived.", "pending_review"],
  ["isFeatured", "Opcional", "Destacado", "SI o NO.", "NO"],
  ["featuredOrder", "Opcional", "Orden destacado", "Numero si Destacado = SI.", ""],
  ["observations", "Opcional", "Observaciones internas", "Notas para el equipo administrador. No se envia al backend.", ""],
];

const listValues = {
  "Si/No": ["SI", "NO"],
  "Roles usuario": ["editor", "admin", "entrepreneur"],
  "Estados emprendedora": ["draft", "pending_review", "approved", "rejected", "inactive", "active"],
  "Estados producto": ["draft", "pending_review", "approved", "published", "rejected", "inactive", "archived"],
  "Tipos documento": ["CC", "CE", "NIT", "Pasaporte", "Otro"],
  "Formatos imagen": ["JPG", "PNG", "WEBP"],
};

function writeTitle(sheet, title, subtitle, lastColumn) {
  sheet.getRange(`A1:${lastColumn}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format = {
    fill: colors.darkPurple,
    font: { bold: true, color: "#FFFFFF", size: 18 },
  };

  sheet.getRange(`A2:${lastColumn}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format = {
    fill: colors.lavender,
    font: { color: colors.muted, size: 11 },
    wrapText: true,
  };
}

function styleTable(sheet, rangeAddress, headerAddress) {
  sheet.getRange(headerAddress).format = {
    fill: colors.purple,
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
  sheet.getRange(rangeAddress).format.borders = {
    preset: "all",
    style: "thin",
    color: colors.border,
  };
}

function addDataValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = {
    rule: {
      type: "list",
      values,
    },
  };
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width;
  });
}

function createListsSheet(workbook) {
  const sheet = workbook.worksheets.add("Listas");
  sheet.showGridLines = false;
  sheet.getRange("A1:B1").values = [["Lista", "Valor permitido"]];
  sheet.getRange("A1:B1").format = {
    fill: colors.darkPurple,
    font: { bold: true, color: "#FFFFFF" },
  };

  const rows = [];
  for (const [name, values] of Object.entries(listValues)) {
    values.forEach((value) => rows.push([name, value]));
  }
  sheet.getRangeByIndexes(1, 0, rows.length, 2).values = rows;
  sheet.getRange(`A1:B${rows.length + 1}`).format.borders = {
    preset: "all",
    style: "thin",
    color: colors.border,
  };
  sheet.getRange("A:A").format.columnWidth = 28;
  sheet.getRange("B:B").format.columnWidth = 24;
  return sheet;
}

function createInstructionsSheet(workbook, type) {
  const sheet = workbook.worksheets.add("Instrucciones");
  sheet.showGridLines = false;
  writeTitle(
    sheet,
    type === "entrepreneurs"
      ? "Plantilla para recoleccion de emprendedoras"
      : "Plantilla para recoleccion de productos",
    "Diligencia la hoja Plantilla. Las columnas marcadas como Obligatorio deben estar completas antes de cargar la informacion al sistema.",
    "E",
  );

  const rows = type === "entrepreneurs"
    ? [
        ["Uso", "Recolectar informacion para crear perfiles de emprendedoras en RED MUEMMA."],
        ["Imagenes", "Registra el nombre exacto del archivo entregado para foto de perfil y banner. La carga real de imagen se realiza desde el panel o proceso de importacion."],
        ["Estado recomendado", "pending_review para revision administrativa antes de publicacion."],
        ["Slug", "Usar minusculas, numeros y guiones. No usar espacios, tildes ni caracteres especiales."],
      ]
    : [
        ["Uso", "Recolectar productos asociados a emprendedoras existentes y aprobadas."],
        ["Relacion", "El campo entrepreneurId es obligatorio para asociar cada producto a una emprendedora."],
        ["Imagenes", "Se permiten hasta tres nombres de archivo por producto. La primera imagen sera tratada como principal."],
        ["Estado recomendado", "pending_review para revision administrativa antes de publicacion."],
      ];

  sheet.getRange("A5:B8").values = rows;
  sheet.getRange("A5:A8").format = {
    fill: colors.softPink,
    font: { bold: true, color: colors.darkPurple },
  };
  sheet.getRange("B5:B8").format = { wrapText: true, font: { color: colors.ink } };
  sheet.getRange("A5:B8").format.borders = {
    preset: "all",
    style: "thin",
    color: colors.border,
  };
  sheet.getRange("A:A").format.columnWidth = 22;
  sheet.getRange("B:B").format.columnWidth = 90;
  return sheet;
}

function createTemplateWorkbook({ type, columns, title, subtitle, fileName }) {
  const workbook = Workbook.create();
  const sheet = workbook.worksheets.add("Plantilla");
  sheet.showGridLines = false;

  createInstructionsSheet(workbook, type);
  createListsSheet(workbook);

  writeTitle(sheet, title, subtitle, "E");

  const metadataHeaders = ["Campo backend", "Requisito", "Nombre para diligenciar", "Regla / descripcion", "Ejemplo"];
  sheet.getRange("A4:E4").values = [metadataHeaders];
  sheet.getRangeByIndexes(4, 0, columns.length, 5).values = columns;
  styleTable(sheet, `A4:E${columns.length + 4}`, "A4:E4");
  sheet.getRange(`B5:B${columns.length + 4}`).format = { fill: colors.required, font: { bold: true, color: colors.darkPurple } };
  sheet.getRange(`D5:D${columns.length + 4}`).format.wrapText = true;
  sheet.getRange("A:E").format.rowHeight = 24;

  const dataHeaders = columns.map((column) => column[0]);
  const dataStartRow = columns.length + 8;
  const dataHeaderRow = dataStartRow;
  const dataFirstRow = dataStartRow + 1;
  const reservedRows = 50;
  const lastColumnIndex = dataHeaders.length - 1;
  const lastColumnLetter = columnLetter(lastColumnIndex);

  sheet.getRangeByIndexes(dataHeaderRow - 1, 0, 1, dataHeaders.length).values = [dataHeaders];
  sheet.getRangeByIndexes(dataHeaderRow, 0, reservedRows, dataHeaders.length).values = Array.from({ length: reservedRows }, () => Array(dataHeaders.length).fill(""));
  styleTable(sheet, `A${dataHeaderRow}:${lastColumnLetter}${dataHeaderRow + reservedRows}`, `A${dataHeaderRow}:${lastColumnLetter}${dataHeaderRow}`);

  sheet.freezePanes.freezeRows(dataHeaderRow);

  setWidths(sheet, dataHeaders.map((header) => {
    if (["bio", "personalStory", "description", "observations"].includes(header)) return 36;
    if (["shortBio", "shortDescription", "imageAltText"].includes(header)) return 30;
    if (header.toLowerCase().includes("url") || header.toLowerCase().includes("filename")) return 28;
    return 18;
  }));

  const headerIndex = Object.fromEntries(dataHeaders.map((header, index) => [header, index]));
  const rowsRange = `${dataFirstRow}:${dataHeaderRow + reservedRows}`;

  if (headerIndex.status !== undefined) {
    const list = type === "entrepreneurs" ? listValues["Estados emprendedora"] : listValues["Estados producto"];
    addDataValidation(sheet, `${columnLetter(headerIndex.status)}${dataFirstRow}:${columnLetter(headerIndex.status)}${dataHeaderRow + reservedRows}`, list);
  }
  if (headerIndex.documentType !== undefined) {
    addDataValidation(sheet, `${columnLetter(headerIndex.documentType)}${dataFirstRow}:${columnLetter(headerIndex.documentType)}${dataHeaderRow + reservedRows}`, listValues["Tipos documento"]);
  }
  ["hasPrice", "managesStock", "isFeatured"].forEach((header) => {
    if (headerIndex[header] !== undefined) {
      addDataValidation(sheet, `${columnLetter(headerIndex[header])}${dataFirstRow}:${columnLetter(headerIndex[header])}${dataHeaderRow + reservedRows}`, listValues["Si/No"]);
    }
  });

  sheet.getRangeByIndexes(dataHeaderRow, 0, reservedRows, dataHeaders.length).format.wrapText = true;
  sheet.getRangeByIndexes(dataHeaderRow, 0, reservedRows, dataHeaders.length).format = {
    fill: colors.optional,
    font: { color: colors.ink },
  };

  const requiredColumns = columns
    .map((column, index) => [column[1], index])
    .filter(([requirement]) => requirement === "Obligatorio")
    .map(([, index]) => index);

  requiredColumns.forEach((index) => {
    sheet.getRange(`${columnLetter(index)}${dataFirstRow}:${columnLetter(index)}${dataHeaderRow + reservedRows}`).format.fill = "#FFF7ED";
  });

  sheet.getRangeByIndexes(dataHeaderRow, 0, reservedRows, dataHeaders.length).format.borders = {
    preset: "inside",
    style: "thin",
    color: "#EEF2F7",
  };

  return { workbook, fileName, previewSheet: "Plantilla", previewRange: "A1:E18", rowsRange };
}

function columnLetter(index) {
  let letter = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    value = Math.floor((value - 1) / 26);
  }
  return letter;
}

const templates = [
  createTemplateWorkbook({
    type: "entrepreneurs",
    columns: entrepreneurColumns,
    title: "RED MUEMMA - Recoleccion de datos de emprendedoras",
    subtitle: "Campos alineados con el contrato CreateEntrepreneurRequest y el formulario administrativo de emprendedoras.",
    fileName: "plantilla-emprendedoras-red-muemma.xlsx",
  }),
  createTemplateWorkbook({
    type: "products",
    columns: productColumns,
    title: "RED MUEMMA - Recoleccion de datos de productos",
    subtitle: "Campos alineados con el contrato CreateProductRequest y el formulario administrativo de productos.",
    fileName: "plantilla-productos-red-muemma.xlsx",
  }),
];

await fs.mkdir(outputDir, { recursive: true });

for (const template of templates) {
  const inspect = await template.workbook.inspect({
    kind: "table",
    sheetId: "Plantilla",
    range: "A1:E12",
    include: "values",
    tableMaxRows: 12,
    tableMaxCols: 5,
  });
  console.log(inspect.ndjson);

  const errors = await template.workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 300 },
    summary: "final formula error scan",
  });
  console.log(errors.ndjson);

  const output = await SpreadsheetFile.exportXlsx(template.workbook);
  await output.save(`${outputDir}/${template.fileName}`);
}

console.log(`Created ${templates.length} workbooks in ${outputDir}`);
