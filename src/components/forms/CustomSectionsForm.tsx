"use client";

import { useResumeStore } from "@/store/resumeStore";
import BulletList from "./BulletList";
import EntryControls from "./EntryControls";

const suggestions = ["Volunteering", "Publications", "Awards", "Leadership", "Hobbies"];

/** Free-form sections (heading + bullets) for anything the fixed sections don't cover. */
export default function CustomSectionsForm() {
  const { resume, addCustomSection, updateCustomSection, removeCustomSection, moveEntry } = useResumeStore();
  const sections = resume.customSections ?? [];

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Custom sections</h2>
        <button onClick={addCustomSection} className="btn btn-add">+ Add section</button>
      </div>

      {sections.length === 0 && (
        <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
          Add anything else worth showing, e.g. {suggestions.join(", ")}.
        </p>
      )}

      <div className="grid gap-3">
        {sections.map((s, idx) => (
          <div key={s.id} className="entry grid gap-3">
            <label className="field-label">
              Section heading
              <input
                placeholder="e.g. Volunteering"
                list="custom-section-suggestions"
                value={s.heading}
                onChange={(e) => updateCustomSection(s.id, { heading: e.target.value })}
                className="field"
              />
            </label>

            <BulletList
              bullets={s.bullets}
              onChange={(bullets) => updateCustomSection(s.id, { bullets })}
              context={{ title: s.heading, company: "" }}
            />

            <EntryControls
              index={idx}
              count={sections.length}
              onMove={(to) => moveEntry("customSections", idx, to)}
              onRemove={() => removeCustomSection(s.id)}
              label="section"
              confirm={!!(s.heading || s.bullets.some((b) => b.trim()))}
            />
          </div>
        ))}
      </div>

      <datalist id="custom-section-suggestions">
        {suggestions.map((s) => <option key={s} value={s} />)}
      </datalist>
    </div>
  );
}
