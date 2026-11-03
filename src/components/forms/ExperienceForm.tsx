"use client";

import { useResumeStore } from "@/store/resumeStore";
import BulletList from "./BulletList";
import EntryControls from "./EntryControls";

export default function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience, moveEntry } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Experience</h2>
        <button onClick={addExperience} className="btn btn-add">+ Add experience</button>
      </div>

      {resume.experience.length === 0 && (
        <p className="card-hint">No experience yet. Freshers can skip this and fill in Projects instead.</p>
      )}

      <div className="grid gap-3">
        {resume.experience.map((exp, idx) => {
          const isCurrent = exp.endDate === "present";
          return (
            <div key={exp.id} className="entry grid gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="field-label">
                  Job title
                  <input
                    placeholder="e.g. Frontend Engineer"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                    className="field"
                  />
                </label>
                <label className="field-label">
                  Company
                  <input
                    placeholder="e.g. Acme Corp"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    className="field"
                  />
                </label>
              </div>

              <label className="field-label">
                Location (optional)
                <input
                  placeholder="e.g. Bengaluru, India"
                  value={exp.location ?? ""}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  className="field"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <BulletList
                bullets={exp.bullets}
                onChange={(bullets) => updateExperience(exp.id, { bullets })}
                context={{ title: exp.title, company: exp.company }}
              />

              <EntryControls
                index={idx}
                count={resume.experience.length}
                onMove={(to) => moveEntry("experience", idx, to)}
                onRemove={() => removeExperience(exp.id)}
                label="experience"
                confirm={!!(exp.title || exp.company || exp.bullets.some((b) => b.trim()))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
