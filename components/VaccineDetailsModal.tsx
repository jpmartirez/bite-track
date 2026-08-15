/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, Calendar, ShieldCheck, User, Activity } from "lucide-react";
import {
  RabiesCase,
  SexOption,
  IncomeOption,
  PrevVacOption,
  OwnershipOption,
  WoundCareOption,
  ConsultOption,
  DoseRemark,
  ComplianceStatus,
} from "../types/rabies";

interface VaccineDetailsModalProps {
  isOpen: boolean;
  caseRecord: RabiesCase | null;
  onSave: (updatedCase: RabiesCase) => void;
  onClose: () => void;
}

const ANIMAL_STATUS_OPTIONS = ["Alive", "Died", "Vaccinated", "Unvaccinated"];

export const VaccineDetailsModal: React.FC<VaccineDetailsModalProps> = ({
  isOpen,
  caseRecord,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState<RabiesCase | null>(null);
  const [animalStatusList, setAnimalStatusList] = useState<string[]>([]);

  useEffect(() => {
    if (caseRecord) {
      setDraft({ ...caseRecord });
      const list = caseRecord.animalStatus
        ? caseRecord.animalStatus.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      setAnimalStatusList(list);
    } else {
      setDraft(null);
      setAnimalStatusList([]);
    }
  }, [caseRecord]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !draft) return null;

  const handleFieldChange = <K extends keyof RabiesCase>(
    field: K,
    value: RabiesCase[K]
  ) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleToggleAnimalStatus = (status: string) => {
    setAnimalStatusList((prev) => {
      const exists = prev.includes(status);
      const updated = exists ? prev.filter((s) => s !== status) : [...prev, status];
      if (draft) {
        setDraft({ ...draft, animalStatus: updated.join(", ") });
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft) {
      onSave({
        ...draft,
        animalStatus: animalStatusList.join(", "),
      });
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content w-[95%] max-w-4xl p-0 flex flex-col overflow-hidden max-h-[90vh] rounded-[18px]">
        {/* Header - Fixed to top edge */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#fffdf4] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-gray-800 m-0 leading-tight">
                Case Details &amp; Edit Record
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 m-0 mt-0.5">
                Editing record for: <span className="font-semibold text-gray-700">{draft.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container with Scrollable Body & Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* Middle Scrollable Section */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Section 1: Patient's Information */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b pb-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Patient&apos;s Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    className="editbox text-sm"
                    value={draft.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Sex
                  </label>
                  <select
                    className="smallselect text-sm"
                    value={draft.sex || "Male"}
                    onChange={(e) => handleFieldChange("sex", e.target.value as SexOption)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    className="editbox text-sm"
                    value={draft.age || ""}
                    onChange={(e) => handleFieldChange("age", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Socioeconomic Status
                  </label>
                  <select
                    className="smallselect text-sm"
                    value={draft.income || "High income"}
                    onChange={(e) => handleFieldChange("income", e.target.value as IncomeOption)}
                  >
                    <option value="High income">High income</option>
                    <option value="Middle income">Middle income</option>
                    <option value="Low income">Low income</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Address
                  </label>
                  <input
                    type="text"
                    className="editbox text-sm"
                    value={draft.address || ""}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Animal Bite Information */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b pb-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Animal Bite Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Previous Vaccination
                  </label>
                  <select
                    className="smallselect text-sm"
                    value={draft.prevVac || "None"}
                    onChange={(e) => handleFieldChange("prevVac", e.target.value as PrevVacOption)}
                  >
                    <option value="None">None</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    If complete state date/year
                  </label>
                  <input
                    type="date"
                    className="editbox text-sm"
                    value={draft.completeDate || ""}
                    onChange={(e) => handleFieldChange("completeDate", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Source of Bite
                  </label>
                  <input
                    type="text"
                    className="editbox text-sm"
                    value={draft.biteSource || ""}
                    onChange={(e) => handleFieldChange("biteSource", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Type of Ownership
                  </label>
                  <select
                    className="smallselect text-sm"
                    value={draft.ownership || "Pet"}
                    onChange={(e) => handleFieldChange("ownership", e.target.value as OwnershipOption)}
                  >
                    <option value="Pet">Pet</option>
                    <option value="Stray">Stray</option>
                    <option value="Wild">Wild</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Type of Wound
                  </label>
                  <input
                    type="text"
                    className="editbox text-sm"
                    value={draft.woundType || ""}
                    onChange={(e) => handleFieldChange("woundType", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Wound Location
                  </label>
                  <input
                    type="text"
                    className="editbox text-sm"
                    value={draft.woundLocation || ""}
                    onChange={(e) => handleFieldChange("woundLocation", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Type of Bleeding
                  </label>
                  <input
                    type="text"
                    className="editbox text-sm"
                    value={draft.bleeding || ""}
                    onChange={(e) => handleFieldChange("bleeding", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Wound Care
                  </label>
                  <select
                    className="smallselect text-sm"
                    value={draft.woundCare || "Done"}
                    onChange={(e) => handleFieldChange("woundCare", e.target.value as WoundCareOption)}
                  >
                    <option value="Done">Done</option>
                    <option value="Not done">Not done</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Consultation Time
                  </label>
                  <select
                    className="smallselect text-sm"
                    value={draft.consult || "Within 24 hrs"}
                    onChange={(e) => handleFieldChange("consult", e.target.value as ConsultOption)}
                  >
                    <option value="Within 24 hrs">Within 24 hrs</option>
                    <option value="Within 1 week">Within 1 week</option>
                    <option value="After 1 month-year">After 1 month-year</option>
                    <option value="More than a year">More than a year</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                    Status of Biting Animal
                  </label>
                  <div className="checkgroup">
                    <div className="checkgroup-options">
                      {ANIMAL_STATUS_OPTIONS.map((status) => (
                        <label key={status} className="text-xs">
                          <input
                            type="checkbox"
                            value={status}
                            checked={animalStatusList.includes(status)}
                            onChange={() => handleToggleAnimalStatus(status)}
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Vaccine Schedule & Compliance */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Vaccine Schedule &amp; Compliance</span>
              </div>

              {/* 3 Columns for Doses on Desktop screens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1st Dose */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>1ST DOSE</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Dose Date
                      </label>
                      <input
                        type="date"
                        className="editbox text-sm bg-white"
                        value={draft.dose1 || ""}
                        onChange={(e) => handleFieldChange("dose1", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Status Remark
                      </label>
                      <select
                        className="smallselect text-sm bg-white"
                        value={draft.dose1Remark || "Given"}
                        onChange={(e) =>
                          handleFieldChange("dose1Remark", e.target.value as DoseRemark)
                        }
                      >
                        <option value="Given">Given</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2nd Dose */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>2ND DOSE</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Dose Date
                      </label>
                      <input
                        type="date"
                        className="editbox text-sm bg-white"
                        value={draft.dose2 || ""}
                        onChange={(e) => handleFieldChange("dose2", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Status Remark
                      </label>
                      <select
                        className="smallselect text-sm bg-white"
                        value={draft.dose2Remark || "Given"}
                        onChange={(e) =>
                          handleFieldChange("dose2Remark", e.target.value as DoseRemark)
                        }
                      >
                        <option value="Given">Given</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3rd Dose */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>3RD DOSE</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Dose Date
                      </label>
                      <input
                        type="date"
                        className="editbox text-sm bg-white"
                        value={draft.dose3 || ""}
                        onChange={(e) => handleFieldChange("dose3", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Status Remark
                      </label>
                      <select
                        className="smallselect text-sm bg-white"
                        value={draft.dose3Remark || "Given"}
                        onChange={(e) =>
                          handleFieldChange("dose3Remark", e.target.value as DoseRemark)
                        }
                      >
                        <option value="Given">Given</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booster & Compliance Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Booster Dose Date
                  </label>
                  <input
                    type="date"
                    className="editbox text-sm bg-white"
                    value={draft.booster || ""}
                    onChange={(e) => handleFieldChange("booster", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Compliance Status
                  </label>
                  <select
                    className="smallselect text-sm bg-white"
                    value={draft.compliance || "Compliant"}
                    onChange={(e) =>
                      handleFieldChange("compliance", e.target.value as ComplianceStatus)
                    }
                  >
                    <option value="Compliant">Compliant</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed to bottom edge */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-200 bg-[#fffdf4] shrink-0">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccineDetailsModal;
