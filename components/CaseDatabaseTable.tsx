import React, { useState } from "react";
import { Search, X, Eye } from "lucide-react";
import { RabiesCase } from "../types/rabies";

interface CaseDatabaseTableProps {
  cases: RabiesCase[];
  onOpenVaccineDetails: (rabiesCase: RabiesCase) => void;
  onRequestDelete: (rabiesCase: RabiesCase) => void;
}

export const CaseDatabaseTable: React.FC<CaseDatabaseTableProps> = ({
  cases,
  onOpenVaccineDetails,
  onRequestDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = cases.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="card">
      <div className="section-title flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span>Case Database</span>
          <span className="badge badge-info">
            {searchQuery.trim()
              ? `${filteredCases.length} of ${cases.length} Records`
              : `${cases.length} Total Records`}
          </span>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 z-10">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: "38px",
              paddingRight: searchQuery ? "34px" : "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
            className="w-full text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-normal text-gray-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-600 z-10 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Bite Details</th>
              <th>Animal Status</th>
              <th>Vaccine Schedule</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No case records found. Fill out the form above and click &quot;Add Case&quot; to register a record.
                </td>
              </tr>
            ) : filteredCases.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No patient record matching &quot;{searchQuery}&quot;.
                  <br />
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-emerald-700 underline font-semibold cursor-pointer"
                  >
                    Clear search filter
                  </button>
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr key={c.id}>
                  {/* Patient Info Column */}
                  <td>
                    <strong>{c.name || "N/A"}</strong>
                    <br />
                    <span>Sex: {c.sex}</span>
                    <br />
                    <span>Age: {c.age || "N/A"}</span>
                    <br />
                    <span>Income: {c.income}</span>
                    <br />
                    <span>Address: {c.address || "N/A"}</span>
                  </td>

                  {/* Bite Details Column */}
                  <td>
                    <span>Source: {c.biteSource || "N/A"}</span>
                    <br />
                    <span>Ownership: {c.ownership}</span>
                    <br />
                    <span>Wound: {c.woundType || "N/A"}</span>
                    <br />
                    <span>Location: {c.woundLocation || "N/A"}</span>
                    <br />
                    <span>Bleeding: {c.bleeding || "N/A"}</span>
                    <br />
                    <span>Care: {c.woundCare}</span>
                    <br />
                    <span>Previous Vaccine: {c.prevVac}</span>
                    {c.completeDate && (
                      <>
                        <br />
                        <span className="text-xs text-gray-600">
                          (Completed: {c.completeDate})
                        </span>
                      </>
                    )}
                  </td>

                  {/* Animal Status Column */}
                  <td>
                    <strong>{c.animalStatus || "N/A"}</strong>
                    <br />
                    <br />
                    <span>Consultation: {c.consult}</span>
                  </td>

                  {/* Vaccine Schedule Column - Only the View Details button */}
                  <td>
                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() => onOpenVaccineDetails(c)}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>

                  {/* Actions Column */}
                  <td>
                    <button
                      type="button"
                      className="deletebtn"
                      onClick={() => onRequestDelete(c)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseDatabaseTable;
