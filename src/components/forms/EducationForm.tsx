"use client";

import { useResumeStore } from "@/store/resumeStore";
import EntryControls from "./EntryControls";

export default function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation, moveEntry } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Education</h2>
        <button onClick={addEducation} className="btn btn-add">+ Add education</button>
      </div>

      <div className="grid gap-3">
        {resume.education.map((edu, idx) => (
          <div key={edu.id} className="entry grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="field-label">
                Institution
                <input
                  placeholder="e.g. IIT Delhi"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  className="field"
                />
              </label>
              <label className="field-label">
                Degree
                <input
                  placeholder="e.g. B.Tech"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  className="field"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="field-label">
                Field of study
                <input
                  placeholder="e.g. Computer Science"
                  value={edu.field ?? ""}
                  onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                  className="field"
                />
              </label>
              <label className="field-label">
                Score (optional)
                <input
                  placeholder="e.g. 8.4 CGPA"
                  value={edu.score ?? ""}
                  onChange={(e) => updateEducation(edu.id, { score: e.target.value })}
                  className="field"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="field-label">
                Start date
                <input
                  type="month"
                  value={edu.startDate ?? ""}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  className="field"
                />
              </label>
              <label className="field-label">
                End date
                <input
                  type="month"
                  value={edu.endDate ?? ""}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  className="field"
                />
              </label>
            </div>

            <EntryControls
              index={idx}
              count={resume.education.length}
              onMove={(to) => moveEntry("education", idx, to)}
              onRemove={() => removeEducation(edu.id)}
              label="education"
              confirm={!!(edu.institution || edu.degree)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
