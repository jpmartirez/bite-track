/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, Calendar, ShieldCheck } from "lucide-react";
import { RabiesCase, DoseRemark, ComplianceStatus } from "../types/rabies";

interface VaccineDetailsModalProps {
  isOpen: boolean;
  caseRecord: RabiesCase | null;
  onSave: (updatedCase: RabiesCase) => void;
  onClose: () => void;
}

export const VaccineDetailsModal: React.FC<VaccineDetailsModalProps> = ({
  isOpen,
  caseRecord,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState<RabiesCase | null>(null);

  useEffect(() => {
    setDraft(caseRecord ? { ...caseRecord } : null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft) {
      onSave(draft);
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
      <div className="modal-content max-w-lg p-0 flex flex-col overflow-hidden max-h-[85vh] sm:max-h-[90vh] rounded-[18px]">
    
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-[#fffdf4] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 m-0 leading-tight">
                Vaccine Schedule &amp; Compliance
              </h3>
              <p className="text-xs text-gray-500 m-0 mt-0.5">
                Patient: <span className="font-semibold text-gray-700">{draft.name}</span>
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
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* 1st Dose */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>1ST DOSE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

            {/* Booster & Compliance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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

         
          <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-gray-200 bg-[#fffdf4] shrink-0">
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
