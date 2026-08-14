import React from "react";
import { NewCaseFormData, SexOption, IncomeOption } from "../types/rabies";

interface PatientInfoFormProps {
	formData: NewCaseFormData;
	onChange: <K extends keyof NewCaseFormData>(
		field: K,
		value: NewCaseFormData[K],
	) => void;
	errors: Record<string, string>;
}

export const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
	formData,
	onChange,
	errors,
}) => {
	return (
		<div className="card">
			<div className="section-title">
				<span>Patients Information</span>
				<span className="text-xs text-red-600 font-normal">
					* All fields required
				</span>
			</div>

			<div className="grid-layout">
				<div>
					<label htmlFor="patientName">
						Name <span className="required-asterisk">*</span>
					</label>
					<input
						id="patientName"
						type="text"
						placeholder="Enter patient full name"
						value={formData.name}
						onChange={(e) => onChange("name", e.target.value)}
						className={errors.name ? "input-error" : ""}
					/>
					{errors.name && <div className="error-text">{errors.name}</div>}
				</div>

				<div>
					<label htmlFor="sex">
						Sex <span className="required-asterisk">*</span>
					</label>
					<select
						id="sex"
						value={formData.sex}
						onChange={(e) => onChange("sex", e.target.value as SexOption)}
						className={errors.sex ? "input-error" : ""}
					>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
					</select>
					{errors.sex && <div className="error-text">{errors.sex}</div>}
				</div>

				<div>
					<label htmlFor="age">
						Age <span className="required-asterisk">*</span>
					</label>
					<input
						id="age"
						type="number"
						min="0"
						max="120"
						placeholder="Enter age"
						value={formData.age}
						onChange={(e) => onChange("age", e.target.value)}
						className={errors.age ? "input-error" : ""}
					/>
					{errors.age && <div className="error-text">{errors.age}</div>}
				</div>

				<div>
					<label htmlFor="income">
						Socioeconomic Status <span className="required-asterisk">*</span>
					</label>
					<select
						id="income"
						value={formData.income}
						onChange={(e) => onChange("income", e.target.value as IncomeOption)}
						className={errors.income ? "input-error" : ""}
					>
						<option value="High income">High income</option>
						<option value="Middle income">Middle income</option>
						<option value="Low income">Low income</option>
					</select>
					{errors.income && <div className="error-text">{errors.income}</div>}
				</div>

				<div className="col-span-md-2">
					<label htmlFor="address">
						Address <span className="required-asterisk">*</span>
					</label>
					<input
						id="address"
						type="text"
						placeholder="Enter complete address"
						value={formData.address}
						onChange={(e) => onChange("address", e.target.value)}
						className={errors.address ? "input-error" : ""}
					/>
					{errors.address && <div className="error-text">{errors.address}</div>}
				</div>
			</div>
		</div>
	);
};

export default PatientInfoForm;
