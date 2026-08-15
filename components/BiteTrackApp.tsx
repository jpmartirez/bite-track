/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import PatientInfoForm from "./PatientInfoForm";
import AnimalBiteForm from "./AnimalBiteForm";
import CaseDatabaseTable from "./CaseDatabaseTable";
import Modal, { ModalVariant } from "./Modal";
import VaccineDetailsModal from "./VaccineDetailsModal";
import LoadingSpinner from "./LoadingSpinner";
import { RabiesCase, NewCaseFormData } from "../types/rabies";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import {
	fetchCasesFromSupabase,
	addCaseToSupabase,
	updateCaseInSupabase,
	deleteCaseFromSupabase,
} from "../lib/casesService";
import { exportCasesToMonthlyExcel } from "../utils/excelExporter";
import { Database, AlertCircle } from "lucide-react";

const LOCAL_STORAGE_KEY = "rabiesDB";

const initialFormState: NewCaseFormData = {
	name: "",
	sex: "Male",
	age: "",
	income: "High income",
	address: "",
	prevVac: "None",
	completeDate: "",
	biteSource: "",
	ownership: "Pet",
	woundType: "",
	woundLocation: "",
	bleeding: "",
	woundCare: "Done",
	animalStatusList: [],
	consult: "Within 24 hrs",
	dose1: "",
	dose2: "",
	dose3: "",
	booster: "",
};

interface ModalState {
	isOpen: boolean;
	title: string;
	description: React.ReactNode;
	variant: ModalVariant;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
}

export const BiteTrackApp: React.FC = () => {
	const [cases, setCases] = useState<RabiesCase[]>([]);
	const [formData, setFormData] = useState<NewCaseFormData>(initialFormState);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [isMutating, setIsMutating] = useState(false);
	const [usingSupabase, setUsingSupabase] = useState(false);

	// Modal States
	const [modalConfig, setModalConfig] = useState<ModalState>({
		isOpen: false,
		title: "",
		description: null,
		variant: "info",
	});
	const [selectedVaccineCase, setSelectedVaccineCase] =
		useState<RabiesCase | null>(null);

	// Fetch Cases from Supabase or LocalStorage fallback
	const loadDatabaseCases = useCallback(async () => {
		setIsLoading(true);
		const hasConfig = isSupabaseConfigured();
		setUsingSupabase(hasConfig);

		if (hasConfig) {
			try {
				const data = await fetchCasesFromSupabase();
				setCases(data);
			} catch (err: any) {
				console.error("Failed to fetch cases from Supabase:", err);
				try {
					const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
					if (stored) setCases(JSON.parse(stored));
				} catch (e) {
					console.error("Failed to read local storage fallback:", e);
				}
			} finally {
				setIsLoading(false);
			}
		} else {
			try {
				const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
				if (stored) {
					setCases(JSON.parse(stored));
				}
			} catch (e) {
				console.error("Failed to parse cases from LocalStorage:", e);
			} finally {
				setIsLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		loadDatabaseCases();
	}, [loadDatabaseCases]);

	const closeModal = () => {
		setModalConfig((prev) => ({ ...prev, isOpen: false }));
	};

	const handleFormFieldChange = <K extends keyof NewCaseFormData>(
		field: K,
		value: NewCaseFormData[K],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const handleToggleAnimalStatus = (status: string) => {
		setFormData((prev) => {
			const exists = prev.animalStatusList.includes(status);
			const updatedList = exists
				? prev.animalStatusList.filter((s) => s !== status)
				: [...prev.animalStatusList, status];
			return { ...prev, animalStatusList: updatedList };
		});

		if (errors.animalStatus) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next.animalStatus;
				return next;
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Patient Name is required.";
		}
		if (!formData.sex) {
			newErrors.sex = "Sex is required.";
		}
		if (!formData.age.trim()) {
			newErrors.age = "Age is required.";
		}
		if (!formData.income) {
			newErrors.income = "Socioeconomic status is required.";
		}
		if (!formData.address.trim()) {
			newErrors.address = "Address is required.";
		}
		if (formData.animalStatusList.length === 0) {
			newErrors.animalStatus =
				"At least one animal status option must be selected.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleAddCase = async () => {
		if (!validateForm()) {
			setModalConfig({
				isOpen: true,
				title: "Required Fields Missing",
				description: (
					<span>
						Please complete all required fields under{" "}
						<strong>Patient&apos;s Information</strong> and select at least one
						option under <strong>Status of Biting Animal</strong>.
					</span>
				),
				variant: "warning",
				cancelText: "Got it",
			});
			return;
		}

		const patientName = formData.name.trim();
		const newRecordData = {
			name: patientName,
			sex: formData.sex,
			age: formData.age.trim(),
			income: formData.income,
			address: formData.address.trim(),
			prevVac: formData.prevVac,
			completeDate: formData.completeDate,
			biteSource: formData.biteSource.trim(),
			ownership: formData.ownership,
			woundType: formData.woundType.trim(),
			woundLocation: formData.woundLocation.trim(),
			bleeding: formData.bleeding.trim(),
			woundCare: formData.woundCare,
			animalStatus: formData.animalStatusList.join(", "),
			consult: formData.consult,
			dose1: formData.dose1,
			dose2: formData.dose2,
			dose3: formData.dose3,
			booster: formData.booster,
			dose1Remark: "Given" as const,
			dose2Remark: "Given" as const,
			dose3Remark: "Given" as const,
			compliance: "Compliant" as const,
		};

		setIsMutating(true);
		try {
			if (usingSupabase) {
				const createdRecord = await addCaseToSupabase(newRecordData);
				setCases((prev) => [createdRecord, ...prev]);
			} else {
				const fallbackRecord: RabiesCase = {
					id: Date.now(),
					createdAt: new Date().toISOString(),
					...newRecordData,
				};
				const updatedCases = [fallbackRecord, ...cases];
				setCases(updatedCases);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));
			}

			setFormData(initialFormState);
			setErrors({});

			setModalConfig({
				isOpen: true,
				title: "Case Registered Successfully",
				description: (
					<span>
						Patient <strong>{patientName}</strong> has been successfully added
						to the Rabies Case Surveillance Database.
					</span>
				),
				variant: "success",
				cancelText: "Done",
			});
		} catch (err: any) {
			setModalConfig({
				isOpen: true,
				title: "Error Saving Case",
				description:
					err?.message || "An error occurred while saving to the database.",
				variant: "danger",
				cancelText: "Close",
			});
		} finally {
			setIsMutating(false);
		}
	};

	const handleRequestDelete = (caseRecord: RabiesCase) => {
		setModalConfig({
			isOpen: true,
			title: "Confirm Case Deletion",
			description: (
				<span>
					Are you sure you want to delete the record for{" "}
					<strong>{caseRecord.name}</strong>? This action cannot be undone.
				</span>
			),
			variant: "danger",
			confirmText: "Delete Record",
			cancelText: "Cancel",
			onConfirm: async () => {
				setIsMutating(true);
				try {
					if (usingSupabase) {
						await deleteCaseFromSupabase(caseRecord.id);
						setCases((prev) => prev.filter((c) => c.id !== caseRecord.id));
					} else {
						const updatedCases = cases.filter((c) => c.id !== caseRecord.id);
						setCases(updatedCases);
						localStorage.setItem(
							LOCAL_STORAGE_KEY,
							JSON.stringify(updatedCases),
						);
					}
					closeModal();
				} catch (err: any) {
					setModalConfig({
						isOpen: true,
						title: "Error Deleting Case",
						description:
							err?.message || "Failed to delete case record from database.",
						variant: "danger",
						cancelText: "Close",
					});
				} finally {
					setIsMutating(false);
				}
			},
		});
	};

	const handleSaveMonthlyFile = () => {
		if (!cases || cases.length === 0) {
			setModalConfig({
				isOpen: true,
				title: "No Records Found",
				description:
					"There are currently no case records in the database to export.",
				variant: "warning",
				cancelText: "Got it",
			});
			return;
		}

		try {
			exportCasesToMonthlyExcel(cases);
			setModalConfig({
				isOpen: true,
				title: "Monthly File Saved",
				description:
					"The monthly Rabies surveillance report Excel file (.xlsx) has been generated and downloaded successfully.",
				variant: "success",
				cancelText: "Done",
			});
		} catch (err: any) {
			setModalConfig({
				isOpen: true,
				title: "Export Error",
				description: err?.message || "Failed to generate monthly Excel report.",
				variant: "danger",
				cancelText: "Close",
			});
		}
	};

	const handleSaveVaccineSchedule = async (updatedCase: RabiesCase) => {
		setIsMutating(true);
		try {
			if (usingSupabase) {
				const saved = await updateCaseInSupabase(updatedCase.id, updatedCase);
				setCases((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
			} else {
				const updatedCases = cases.map((c) =>
					c.id === updatedCase.id ? updatedCase : c,
				);
				setCases(updatedCases);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));
			}
			setSelectedVaccineCase(null);
		} catch (err: any) {
			setModalConfig({
				isOpen: true,
				title: "Error Updating Record",
				description: err?.message || "Failed to update record in database.",
				variant: "danger",
				cancelText: "Close",
			});
		} finally {
			setIsMutating(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="container flex-1">
				{!usingSupabase && (
					<div className="card bg-amber-50 border border-amber-200 text-amber-900 mb-6 p-4 rounded-xl flex items-start gap-3 shadow-none">
						<AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
						<div className="text-xs sm:text-sm leading-relaxed">
							<strong className="font-bold block mb-0.5 text-amber-950">
								Supabase Setup Required
							</strong>
							Add your{" "}
							<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">
								NEXT_PUBLIC_SUPABASE_URL
							</code>{" "}
							and{" "}
							<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">
								NEXT_PUBLIC_SUPABASE_ANON_KEY
							</code>{" "}
							credentials to your{" "}
							<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">
								.env
							</code>{" "}
							file to connect your live Supabase cloud database. (Currently
							running in LocalStorage fallback mode).
						</div>
					</div>
				)}

				{usingSupabase && (
					<div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-4 px-1">
						<Database className="w-4 h-4 text-emerald-600" />
						<span>Connected to Supabase Cloud Database</span>
					</div>
				)}

				<PatientInfoForm
					formData={formData}
					onChange={handleFormFieldChange}
					errors={errors}
				/>
				<AnimalBiteForm
					formData={formData}
					onChange={handleFormFieldChange}
					onToggleAnimalStatus={handleToggleAnimalStatus}
					onAddCase={handleAddCase}
					onSaveMonthlyFile={handleSaveMonthlyFile}
					errors={errors}
				/>

				{isLoading ? (
					<div className="card">
						<LoadingSpinner message="Fetching cases from Supabase Database..." />
					</div>
				) : (
					<CaseDatabaseTable
						cases={cases}
						onOpenVaccineDetails={(c) => setSelectedVaccineCase(c)}
						onRequestDelete={handleRequestDelete}
						onRefresh={loadDatabaseCases}
						isRefreshing={isMutating}
					/>
				)}
			</main>

			<Modal
				isOpen={modalConfig.isOpen}
				title={modalConfig.title}
				description={modalConfig.description}
				variant={modalConfig.variant}
				confirmText={modalConfig.confirmText}
				cancelText={modalConfig.cancelText}
				onConfirm={modalConfig.onConfirm}
				onCancel={closeModal}
			/>

			<VaccineDetailsModal
				isOpen={Boolean(selectedVaccineCase)}
				caseRecord={selectedVaccineCase}
				onSave={handleSaveVaccineSchedule}
				onClose={() => setSelectedVaccineCase(null)}
			/>
		</div>
	);
};

export default BiteTrackApp;
