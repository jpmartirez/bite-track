import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { RabiesCase, DoseRemark, ComplianceStatus, SexOption, IncomeOption, PrevVacOption, OwnershipOption, WoundCareOption, ConsultOption } from "../types/rabies";

export interface SupabaseCaseRow {
  id: number;
  created_at?: string;
  name: string;
  sex: string;
  age: string;
  income: string;
  address: string;
  prev_vac?: string | null;
  complete_date?: string | null;
  bite_source?: string | null;
  ownership?: string | null;
  wound_type?: string | null;
  wound_location?: string | null;
  bleeding?: string | null;
  wound_care?: string | null;
  animal_status: string;
  consult?: string | null;
  dose1?: string | null;
  dose2?: string | null;
  dose3?: string | null;
  booster?: string | null;
  dose1_remark?: string | null;
  dose2_remark?: string | null;
  dose3_remark?: string | null;
  compliance?: string | null;
}

const mapRowToRabiesCase = (row: SupabaseCaseRow): RabiesCase => {
  return {
    id: row.id,
    name: row.name || "",
    sex: (row.sex || "Male") as SexOption,
    age: row.age || "",
    income: (row.income || "High income") as IncomeOption,
    address: row.address || "",
    prevVac: (row.prev_vac || "None") as PrevVacOption,
    completeDate: row.complete_date || "",
    biteSource: row.bite_source || "",
    ownership: (row.ownership || "Pet") as OwnershipOption,
    woundType: row.wound_type || "",
    woundLocation: row.wound_location || "",
    bleeding: row.bleeding || "",
    woundCare: (row.wound_care || "Done") as WoundCareOption,
    animalStatus: row.animal_status || "",
    consult: (row.consult || "Within 24 hrs") as ConsultOption,
    dose1: row.dose1 || "",
    dose2: row.dose2 || "",
    dose3: row.dose3 || "",
    booster: row.booster || "",
    dose1Remark: (row.dose1_remark || "Given") as DoseRemark,
    dose2Remark: (row.dose2_remark || "Given") as DoseRemark,
    dose3Remark: (row.dose3_remark || "Given") as DoseRemark,
    compliance: (row.compliance || "Compliant") as ComplianceStatus,
  };
};

export const fetchCasesFromSupabase = async (): Promise<RabiesCase[]> => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet. Please add your credentials to .env");
  }

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching cases from Supabase:", error);
    throw error;
  }

  return (data as SupabaseCaseRow[]).map(mapRowToRabiesCase);
};

export const addCaseToSupabase = async (
  newCaseData: Omit<RabiesCase, "id">
): Promise<RabiesCase> => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet. Please add your credentials to .env");
  }

  const dbRow = {
    name: newCaseData.name,
    sex: newCaseData.sex,
    age: newCaseData.age,
    income: newCaseData.income,
    address: newCaseData.address,
    prev_vac: newCaseData.prevVac,
    complete_date: newCaseData.completeDate,
    bite_source: newCaseData.biteSource,
    ownership: newCaseData.ownership,
    wound_type: newCaseData.woundType,
    wound_location: newCaseData.woundLocation,
    bleeding: newCaseData.bleeding,
    wound_care: newCaseData.woundCare,
    animal_status: newCaseData.animalStatus,
    consult: newCaseData.consult,
    dose1: newCaseData.dose1,
    dose2: newCaseData.dose2,
    dose3: newCaseData.dose3,
    booster: newCaseData.booster,
    dose1_remark: newCaseData.dose1Remark,
    dose2_remark: newCaseData.dose2Remark,
    dose3_remark: newCaseData.dose3Remark,
    compliance: newCaseData.compliance,
  };

  const { data, error } = await supabase
    .from("cases")
    .insert([dbRow])
    .select()
    .single();

  if (error) {
    console.error("Error adding case to Supabase:", error);
    throw error;
  }

  return mapRowToRabiesCase(data as SupabaseCaseRow);
};

export const updateCaseInSupabase = async (
  id: number,
  updatedCase: RabiesCase
): Promise<RabiesCase> => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet. Please add your credentials to .env");
  }

  const dbRow = {
    name: updatedCase.name,
    sex: updatedCase.sex,
    age: updatedCase.age,
    income: updatedCase.income,
    address: updatedCase.address,
    prev_vac: updatedCase.prevVac,
    complete_date: updatedCase.completeDate,
    bite_source: updatedCase.biteSource,
    ownership: updatedCase.ownership,
    wound_type: updatedCase.woundType,
    wound_location: updatedCase.woundLocation,
    bleeding: updatedCase.bleeding,
    wound_care: updatedCase.woundCare,
    animal_status: updatedCase.animalStatus,
    consult: updatedCase.consult,
    dose1: updatedCase.dose1,
    dose2: updatedCase.dose2,
    dose3: updatedCase.dose3,
    booster: updatedCase.booster,
    dose1_remark: updatedCase.dose1Remark,
    dose2_remark: updatedCase.dose2Remark,
    dose3_remark: updatedCase.dose3Remark,
    compliance: updatedCase.compliance,
  };

  const { data, error } = await supabase
    .from("cases")
    .update(dbRow)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating case in Supabase:", error);
    throw error;
  }

  return mapRowToRabiesCase(data as SupabaseCaseRow);
};

export const deleteCaseFromSupabase = async (id: number): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet. Please add your credentials to .env");
  }

  const { error } = await supabase.from("cases").delete().eq("id", id);

  if (error) {
    console.error("Error deleting case from Supabase:", error);
    throw error;
  }
};
