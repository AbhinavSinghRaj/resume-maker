"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Projects</h2>
        <button onClick={addProject} className="btn btn-add">+ Add project</button>
      </div>

      <div className="grid gap-3">
        {resume.projects.map((p) => (
          <div key={p.id} className="entry grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Project name"
                value={p.name}
                onChange={(e) => updateProject(p.id, { name: e.target.value })}
                className="field"
              />
              <input
                placeholder="URL (optional)"
                value={p.url ?? ""}
                onChange={(e) => updateProject(p.id, { url: e.target.value })}
                className="field"
              />
            </div>

            <input
              placeholder="Tech stack, comma se separate (e.g. React, Node.js, MongoDB)"
              value={p.techStack.join(", ")}
              onChange={(e) =>
                updateProject(p.id, {
                  techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="field"
            />

            <label className="field-label">
              Bullets (ek line = ek bullet)
              <textarea
                rows={4}
                value={p.bullets.join("\n")}
                onChange={(e) => updateProject(p.id, { bullets: e.target.value.split("\n") })}
                className="field"
              />
            </label>

            <button onClick={() => removeProject(p.id)} className="btn-danger-text justify-self-end">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}