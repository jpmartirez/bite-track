import XLSX from "xlsx-js-style";
import { RabiesCase } from "../types/rabies";

const getRecordMonthYear = (record: RabiesCase): string => {
  let dateObj = new Date();
  if (record.createdAt) {
    const parsed = new Date(record.createdAt);
    if (!isNaN(parsed.getTime())) {
      dateObj = parsed;
    }
  } else if (record.dose1) {
    const parsed = new Date(record.dose1);
    if (!isNaN(parsed.getTime())) {
      dateObj = parsed;
    }
  }
  return dateObj.toLocaleString("default", { month: "long", year: "numeric" });
};

const formatCaseRowForExcel = (c: RabiesCase) => {
  return {
    "Case ID": c.id,
    "Registration Date": c.createdAt
      ? new Date(c.createdAt).toLocaleDateString()
      : "N/A",
    "Patient Name": c.name || "",
    "Sex": c.sex || "",
    "Age": c.age || "",
    "Socioeconomic Status": c.income || "",
    "Address": c.address || "",
    "Previous Anti-rabies Vaccine": c.prevVac || "",
    "Vaccine Complete Date": c.completeDate || "",
    "Source of Bite": c.biteSource || "",
    "Type of Ownership": c.ownership || "",
    "Type of Wound": c.woundType || "",
    "Wound Location": c.woundLocation || "",
    "Type of Bleeding": c.bleeding || "",
    "Wound Care": c.woundCare || "",
    "Status of Biting Animal": c.animalStatus || "",
    "Consultation Time": c.consult || "",
    "1st Dose Date": c.dose1 || "",
    "1st Dose Remark": c.dose1Remark || "Given",
    "2nd Dose Date": c.dose2 || "",
    "2nd Dose Remark": c.dose2Remark || "Given",
    "3rd Dose Date": c.dose3 || "",
    "3rd Dose Remark": c.dose3Remark || "Given",
    "Booster Date": c.booster || "",
    "Compliance Status": c.compliance || "Compliant",
  };
};

export const exportCasesToMonthlyExcel = (cases: RabiesCase[]): void => {
  if (!cases || cases.length === 0) {
    throw new Error("No records available to export.");
  }

  // Group cases by Month Year (e.g. "August 2026", "September 2026")
  const grouped: Record<string, RabiesCase[]> = {};

  cases.forEach((c) => {
    const monthKey = getRecordMonthYear(c);
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(c);
  });

  // Create new Excel Workbook
  const workbook = XLSX.utils.book_new();

  // Iterate over each month group and add a sheet tab
  Object.keys(grouped).forEach((monthKey) => {
    const monthCases = grouped[monthKey];
    const excelRows = monthCases.map(formatCaseRowForExcel);
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    const headers = Object.keys(excelRows[0] || {});

    // Auto-size column widths dynamically based on headers and data length
    const maxCols = headers.map((header) => {
      let maxLen = header.length;
      excelRows.forEach((row) => {
        const val = String((row as Record<string, unknown>)[header] ?? "");
        if (val.length > maxLen) {
          maxLen = val.length;
        }
      });
      return { wch: Math.max(maxLen + 4, 15) };
    });
    worksheet["!cols"] = maxCols;

    // Set row heights: Header row = 28pt, Data rows = 20pt
    worksheet["!rows"] = [
      { hpt: 28 },
      ...excelRows.map(() => ({ hpt: 20 })),
    ];

    // Decode worksheet range for formatting
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    const headerStyle = {
      font: {
        name: "Calibri",
        sz: 11,
        bold: true,
        color: { rgb: "FFFFFF" },
      },
      fill: {
        patternType: "solid",
        fgColor: { rgb: "15803D" },
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: true,
      },
      border: {
        top: { style: "thin", color: { rgb: "166534" } },
        bottom: { style: "medium", color: { rgb: "14532D" } },
        left: { style: "thin", color: { rgb: "166534" } },
        right: { style: "thin", color: { rgb: "166534" } },
      },
    };

    // Data row styling options with alternating zebra stripes
    const dataStyleEven = {
      font: { name: "Calibri", sz: 10, color: { rgb: "0F172A" } },
      fill: { patternType: "solid", fgColor: { rgb: "F8FAFC" } },
      alignment: { vertical: "center", horizontal: "left" },
      border: {
        top: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
        left: { style: "thin", color: { rgb: "E2E8F0" } },
        right: { style: "thin", color: { rgb: "E2E8F0" } },
      },
    };

    const dataStyleOdd = {
      font: { name: "Calibri", sz: 10, color: { rgb: "0F172A" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFFFFF" } },
      alignment: { vertical: "center", horizontal: "left" },
      border: {
        top: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
        left: { style: "thin", color: { rgb: "E2E8F0" } },
        right: { style: "thin", color: { rgb: "E2E8F0" } },
      },
    };

    // Columns that look better centered
    const centeredFields = new Set([
      "Case ID",
      "Registration Date",
      "Sex",
      "Age",
      "Socioeconomic Status",
      "Previous Anti-rabies Vaccine",
      "Vaccine Complete Date",
      "Type of Ownership",
      "Wound Care",
      "Consultation Time",
      "1st Dose Date",
      "1st Dose Remark",
      "2nd Dose Date",
      "2nd Dose Remark",
      "3rd Dose Date",
      "3rd Dose Remark",
      "Booster Date",
      "Compliance Status",
    ]);

    // Apply styles to cells
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        if (R === 0) {
          // Apply Header style
          worksheet[cellAddress].s = headerStyle;
        } else {
          // Apply Data Row style
          const fieldName = headers[C];
          const isCentered = centeredFields.has(fieldName);
          const baseStyle = R % 2 === 0 ? dataStyleEven : dataStyleOdd;

          worksheet[cellAddress].s = {
            ...baseStyle,
            alignment: {
              vertical: "center",
              horizontal: isCentered ? "center" : "left",
            },
          };
        }
      }
    }

    // Excel sheet name limit is 31 chars
    const sheetName = monthKey.slice(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Download Excel File
  const filename = `Rabies_Surveillance_Monthly_Report_${new Date().getFullYear()}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

