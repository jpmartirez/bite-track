/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import PatientInfoForm from "./PatientInfoForm";
import AnimalBiteForm from "./AnimalBiteForm";
import CaseDatabaseTable from "./CaseDatabaseTable";
import { RabiesCase, NewCaseFormData } from "../types/rabies";

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

export const BiteTrackApp: React.FC = () => {
  const [cases, setCases] = useState<RabiesCase[]>([]);
  const [formData, setFormData] = useState<NewCaseFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate cases from LocalStorage on client side
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setCases(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse cases from LocalStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cases to LocalStorage whenever cases array updates
  const saveToLocalStorage = (updatedCases: RabiesCase[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCases));
    } catch (e) {
      console.error("Failed to save to LocalStorage:", e);
    }
  };

  const handleFormFieldChange = <K extends keyof NewCaseFormData>(
    field: K,
    value: NewCaseFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field if user modifies it
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
      newErrors.animalStatus = "At least one animal status option must be selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCase = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields in Patient's Information and Status of Biting Animal.");
      return;
    }

    const newRecord: RabiesCase = {
      id: Date.now(),
      name: formData.name.trim(),
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
      dose1Remark: "Given",
      dose2Remark: "Given",
      dose3Remark: "Given",
      compliance: "Compliant",
    };

    const updatedCases = [...cases, newRecord];
    setCases(updatedCases);
    saveToLocalStorage(updatedCases);

    // Reset form
    setFormData(initialFormState);
    setErrors({});
    alert("Case added successfully!");
  };

  const handleDeleteCase = (id: number) => {
    if (confirm("Are you sure you want to delete this case?")) {
      const updatedCases = cases.filter((c) => c.id !== id);
      setCases(updatedCases);
      saveToLocalStorage(updatedCases);
    }
  };

  const handleUpdateField = <K extends keyof RabiesCase>(
    id: number,
    field: K,
    value: RabiesCase[K]
  ) => {
    const updatedCases = cases.map((c) => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    });
    setCases(updatedCases);
    saveToLocalStorage(updatedCases);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container flex-1">
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
          errors={errors}
        />
        {isLoaded ? (
          <CaseDatabaseTable
            cases={cases}
            onUpdateField={handleUpdateField}
            onDeleteCase={handleDeleteCase}
          />
        ) : (
          <div className="card text-center py-8">Loading database records...</div>
        )}
      </main>
    </div>
  );
};

export default BiteTrackApp;
