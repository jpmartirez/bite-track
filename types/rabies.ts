export type SexOption = "Male" | "Female";
export type IncomeOption = "High income" | "Middle income" | "Low income";
export type PrevVacOption = "None" | "Incomplete" | "Complete";
export type OwnershipOption = "Pet" | "Stray" | "Wild";
export type WoundCareOption = "Done" | "Not done";
export type ConsultOption =
	| "Within 24 hrs"
	| "Within 1 week"
	| "After 1 month-year"
	| "More than a year";
export type DoseRemark = "Given" | "Not Given";
export type ComplianceStatus = "Compliant" | "Non-Compliant";

export interface RabiesCase {
	id: number;
	name: string;
	sex: SexOption;
	age: string;
	income: IncomeOption;
	address: string;
	prevVac: PrevVacOption;
	completeDate: string;
	biteSource: string;
	ownership: OwnershipOption;
	woundType: string;
	woundLocation: string;
	bleeding: string;
	woundCare: WoundCareOption;
	animalStatus: string;
	consult: ConsultOption;
	dose1: string;
	dose2: string;
	dose3: string;
	booster: string;
	dose1Remark: DoseRemark;
	dose2Remark: DoseRemark;
	dose3Remark: DoseRemark;
	compliance: ComplianceStatus;
}

export type NewCaseFormData = Omit<
	RabiesCase,
	| "id"
	| "dose1Remark"
	| "dose2Remark"
	| "dose3Remark"
	| "compliance"
	| "animalStatus"
> & {
	animalStatusList: string[];
};
