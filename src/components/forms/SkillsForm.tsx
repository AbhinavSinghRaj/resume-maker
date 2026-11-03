"use client";

import { useResumeStore } from "@/store/resumeStore";
import ListInput from "./ListInput";
import EntryControls from "./EntryControls";

export default function SkillsForm() {
  const { resume, addSkillGroup, updateSkillGroup, removeSkillGroup, moveEntry } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Skills</h2>
        <button onClick={addSkillGroup} className="btn btn-add">+ Add skill group</button>
      </div>

      <div className="grid gap-3">
        {resume.skills.map((group, i) => (
          <div key={i} className="entry grid gap-3">
            <label className="field-label">
              Category
              <input
                placeholder="e.g. Languages, Frameworks, Tools"
                value={group.category}
                onChange={(e) => updateSkillGroup(i, { category: e.target.value })}
                className="field"
              />
            </label>
            <label className="field-label">
              Skills (comma-separated)
              <ListInput
                placeholder="e.g. React.js, TypeScript, Next.js"
                value={group.items}
                onChange={(items) => updateSkillGroup(i, { items })}
              />
            </label>
            <EntryControls
              index={i}
              count={resume.skills.length}
              onMove={(to) => moveEntry("skills", i, to)}
              onRemove={() => removeSkillGroup(i)}
              label="skill group"
              confirm={group.items.length > 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
