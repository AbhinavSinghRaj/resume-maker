"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Experience</h2>
        <button onClick={addExperience} className="btn btn-add">+ Add experience</button>
      </div>

      <div className="grid gap-3">
        {resume.experience.map((exp) => {
          const isCurrent = exp.endDate === "present";
          return (
            <div key={exp.id} className="entry grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Job title"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                  className="field"
                />
                <input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  className="field"
                />
              </div>

              <input
                placeholder="Location (optional)"
                value={exp.location ?? ""}
                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                className="field"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="field-label">
                  Start date
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    className="field"
                  />
                </label>
                <label className="field-label">
                  End date
                  <input
                    type="month"
                    disabled={isCurrent}
                    value={isCurrent ? "" : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    className="field disabled:bg-gray-100"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) =>
                    updateExperience(exp.id, { endDate: e.target.checked ? "present" : "" })
                  }
                />
                I currently work here
              </label>

              <label className="field-label">
                Bullets (ek line = ek bullet)
                <textarea
                  rows={5}
                  value={exp.bullets.join("\n")}
                  onChange={(e) => updateExperience(exp.id, { bullets: e.target.value.split("\n") })}
                  className="field"
                />
              </label>

              <button onClick={() => removeExperience(exp.id)} className="btn-danger-text justify-self-end">
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}