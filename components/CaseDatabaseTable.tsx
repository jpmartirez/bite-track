import React from "react";
import { RabiesCase, DoseRemark, ComplianceStatus } from "../types/rabies";

interface CaseDatabaseTableProps {
  cases: RabiesCase[];
  onUpdateField: <K extends keyof RabiesCase>(
    id: number,
    field: K,
    value: RabiesCase[K]
  ) => void;
  onDeleteCase: (id: number) => void;
}

export const CaseDatabaseTable: React.FC<CaseDatabaseTableProps> = ({
  cases,
  onUpdateField,
  onDeleteCase,
}) => {
  return (
    <div className="card">
      <div className="section-title">
        <span>Case Database</span>
        <span className="badge badge-info">{cases.length} Total Records</span>
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
            ) : (
              cases.map((c) => (
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

                  {/* Vaccine Schedule Column */}
                  <td>
                    <div>
                      <strong>1st Dose</strong>
                      <input
                        type="date"
                        className="editbox"
                        value={c.dose1 || ""}
                        onChange={(e) =>
                          onUpdateField(c.id, "dose1", e.target.value)
                        }
                      />
                      <select
                        className="smallselect"
                        value={c.dose1Remark || "Given"}
                        onChange={(e) =>
                          onUpdateField(
                            c.id,
                            "dose1Remark",
                            e.target.value as DoseRemark
                          )
                        }
                      >
                        <option value="Given">Given</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>

                    <hr className="dose-divider" />

                    <div>
                      <strong>2nd Dose</strong>
                      <input
                        type="date"
                        className="editbox"
                        value={c.dose2 || ""}
                        onChange={(e) =>
                          onUpdateField(c.id, "dose2", e.target.value)
                        }
                      />
                      <select
                        className="smallselect"
                        value={c.dose2Remark || "Given"}
                        onChange={(e) =>
                          onUpdateField(
                            c.id,
                            "dose2Remark",
                            e.target.value as DoseRemark
                          )
                        }
                      >
                        <option value="Given">Given</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>

                    <hr className="dose-divider" />

                    <div>
                      <strong>3rd Dose</strong>
                      <input
                        type="date"
                        className="editbox"
                        value={c.dose3 || ""}
                        onChange={(e) =>
                          onUpdateField(c.id, "dose3", e.target.value)
                        }
                      />
                      <select
                        className="smallselect"
                        value={c.dose3Remark || "Given"}
                        onChange={(e) =>
                          onUpdateField(
                            c.id,
                            "dose3Remark",
                            e.target.value as DoseRemark
                          )
                        }
                      >
                        <option value="Given">Given</option>
                        <option value="Not Given">Not Given</option>
                      </select>
                    </div>

                    <hr className="dose-divider" />

                    <div>
                      <strong>Booster</strong>
                      <input
                        type="date"
                        className="editbox"
                        value={c.booster || ""}
                        onChange={(e) =>
                          onUpdateField(c.id, "booster", e.target.value)
                        }
                      />
                    </div>

                    <div className="mt-3">
                      <span>Compliance: </span>
                      <select
                        className="smallselect mt-1"
                        value={c.compliance || "Compliant"}
                        onChange={(e) =>
                          onUpdateField(
                            c.id,
                            "compliance",
                            e.target.value as ComplianceStatus
                          )
                        }
                      >
                        <option value="Compliant">Compliant</option>
                        <option value="Non-Compliant">Non-Compliant</option>
                      </select>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td>
                    <button
                      type="button"
                      className="deletebtn"
                      onClick={() => onDeleteCase(c.id)}
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
