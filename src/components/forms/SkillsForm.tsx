"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function SkillsForm() {
  const { resume, addSkillGroup, updateSkillGroup, removeSkillGroup } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Skills</h2>
        <button onClick={addSkillGroup} className="btn btn-add">+ Add skill group</button>
      </div>

      <div className="grid gap-3">
        {resume.skills.map((group, i) => (
          <div key={i} className="entry grid gap-3">
            <input
              placeholder="Category (e.g. Languages, Frameworks, Tools)"
              value={group.category}
              onChange={(e) => updateSkillGroup(i, { category: e.target.value })}
              className="field"
            />
            <input
              placeholder="Skills, comma se separate kar (e.g. React.js, TypeScript, Next.js)"
              value={group.items.join(", ")}
              onChange={(e) =>
                updateSkillGroup(i, {
                  items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="field"
            />
            <button onClick={() => removeSkillGroup(i)} className="btn-danger-text justify-self-end">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}