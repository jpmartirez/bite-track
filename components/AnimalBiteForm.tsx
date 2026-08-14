import React from "react";
import {
  NewCaseFormData,
  PrevVacOption,
  OwnershipOption,
  WoundCareOption,
  ConsultOption,
} from "../types/rabies";

interface AnimalBiteFormProps {
  formData: NewCaseFormData;
  onChange: <K extends keyof NewCaseFormData>(
    field: K,
    value: NewCaseFormData[K]
  ) => void;
  onToggleAnimalStatus: (status: string) => void;
  onAddCase: () => void;
  errors: Record<string, string>;
}

const ANIMAL_STATUS_OPTIONS = ["Alive", "Died", "Vaccinated", "Unvaccinated"];

export const AnimalBiteForm: React.FC<AnimalBiteFormProps> = ({
  formData,
  onChange,
  onToggleAnimalStatus,
  onAddCase,
  errors,
}) => {
  return (
    <div className="card">
      <div className="section-title">
        <span>Animal Bite Information</span>
      </div>

      <div className="grid-layout">
        <div>
          <label htmlFor="prevVac">Previous Anti-rabies Vaccination</label>
          <select
            id="prevVac"
            value={formData.prevVac}
            onChange={(e) => onChange("prevVac", e.target.value as PrevVacOption)}
          >
            <option value="None">None</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div>
          <label htmlFor="completeDate">If complete state date/year</label>
          <input
            id="completeDate"
            type="date"
            value={formData.completeDate}
            onChange={(e) => onChange("completeDate", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="biteSource">Source of Bite</label>
          <input
            id="biteSource"
            type="text"
            placeholder="e.g. Dog, Cat"
            value={formData.biteSource}
            onChange={(e) => onChange("biteSource", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ownership">Type of Ownership</label>
          <select
            id="ownership"
            value={formData.ownership}
            onChange={(e) => onChange("ownership", e.target.value as OwnershipOption)}
          >
            <option value="Pet">Pet</option>
            <option value="Stray">Stray</option>
            <option value="Wild">Wild</option>
          </select>
        </div>

        <div>
          <label htmlFor="woundType">Type of Wound</label>
          <input
            id="woundType"
            type="text"
            placeholder="e.g. Bite, Scratch"
            value={formData.woundType}
            onChange={(e) => onChange("woundType", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="woundLocation">Wound Location</label>
          <input
            id="woundLocation"
            type="text"
            placeholder="e.g. Right hand, Leg"
            value={formData.woundLocation}
            onChange={(e) => onChange("woundLocation", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="bleeding">Type of Bleeding</label>
          <input
            id="bleeding"
            type="text"
            placeholder="e.g. Mild, Profuse, None"
            value={formData.bleeding}
            onChange={(e) => onChange("bleeding", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="woundCare">Wound Care</label>
          <select
            id="woundCare"
            value={formData.woundCare}
            onChange={(e) => onChange("woundCare", e.target.value as WoundCareOption)}
          >
            <option value="Done">Done</option>
            <option value="Not done">Not done</option>
          </select>
        </div>

        <div>
          <label>
            Status of Biting Animal <span className="required-asterisk">*</span>
          </label>
          <div className={`checkgroup ${errors.animalStatus ? "input-error" : ""}`}>
            <div className="checkgroup-options">
              {ANIMAL_STATUS_OPTIONS.map((status) => (
                <label key={status}>
                  <input
                    type="checkbox"
                    value={status}
                    checked={formData.animalStatusList.includes(status)}
                    onChange={() => onToggleAnimalStatus(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
          {errors.animalStatus && (
            <div className="error-text">{errors.animalStatus}</div>
          )}
        </div>

        <div>
          <label htmlFor="consult">Consultation Time</label>
          <select
            id="consult"
            value={formData.consult}
            onChange={(e) => onChange("consult", e.target.value as ConsultOption)}
          >
            <option value="Within 24 hrs">Within 24 hrs</option>
            <option value="Within 1 week">Within 1 week</option>
            <option value="After 1 month-year">After 1 month-year</option>
            <option value="More than a year">More than a year</option>
          </select>
        </div>

        <div>
          <label htmlFor="dose1">1st Dose</label>
          <input
            id="dose1"
            type="date"
            value={formData.dose1}
            onChange={(e) => onChange("dose1", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="dose2">2nd Dose</label>
          <input
            id="dose2"
            type="date"
            value={formData.dose2}
            onChange={(e) => onChange("dose2", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="dose3">3rd Dose</label>
          <input
            id="dose3"
            type="date"
            value={formData.dose3}
            onChange={(e) => onChange("dose3", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="booster">Booster</label>
          <input
            id="booster"
            type="date"
            value={formData.booster}
            onChange={(e) => onChange("booster", e.target.value)}
          />
        </div>
      </div>

      <div className="buttons">
        <button type="button" className="addbtn" onClick={onAddCase}>
          Add Case
        </button>

        <button
          type="button"
          className="savebtn"
          title="Save Monthly File feature disabled for now"
          onClick={() => {
            alert("Save Monthly File functionality is disabled at this time.");
          }}
        >
          Save Monthly File
        </button>
      </div>
    </div>
  );
};

export default AnimalBiteForm;
