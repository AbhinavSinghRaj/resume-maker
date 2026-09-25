"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Education</h2>
        <button onClick={addEducation} className="btn btn-add">+ Add education</button>
      </div>

      <div className="grid gap-3">
        {resume.education.map((edu) => (
          <div key={edu.id} className="entry grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                className="field"
              />
              <input
                placeholder="Degree (e.g. B.Tech)"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                className="field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Field (e.g. Computer Science)"
                value={edu.field ?? ""}
                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                className="field"
              />
              <input
                placeholder="Score (e.g. 8.4 CGPA)"
                value={edu.score ?? ""}
                onChange={(e) => updateEducation(edu.id, { score: e.target.value })}
                className="field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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

            <button onClick={() => removeEducation(edu.id)} className="btn-danger-text justify-self-end">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}