import * as XLSX from "xlsx";
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

    // Auto-size column widths
    const maxCols = Object.keys(excelRows[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 16),
    }));
    worksheet["!cols"] = maxCols;

    // Excel sheet name limit is 31 chars
    const sheetName = monthKey.slice(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Download Excel File
  const filename = `Rabies_Surveillance_Monthly_Report_${new Date().getFullYear()}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
