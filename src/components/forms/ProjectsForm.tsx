"use client";

import { useResumeStore } from "@/store/resumeStore";
import BulletList from "./BulletList";
import EntryControls from "./EntryControls";
import ListInput from "./ListInput";

export default function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject, moveEntry } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Projects</h2>
        <button onClick={addProject} className="btn btn-add">+ Add project</button>
      </div>

      <div className="grid gap-3">
        {resume.projects.map((p, idx) => (
          <div key={p.id} className="entry grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="field-label">
                Project name
                <input
                  placeholder="e.g. Expense Tracker"
                  value={p.name}
                  onChange={(e) => updateProject(p.id, { name: e.target.value })}
                  className="field"
                />
              </label>
              <label className="field-label">
                URL (optional)
                <input
                  placeholder="e.g. github.com/you/project"
                  value={p.url ?? ""}
                  onChange={(e) => updateProject(p.id, { url: e.target.value })}
                  className="field"
                />
              </label>
            </div>

            <label className="field-label">
              Tech stack (comma-separated)
              <ListInput
                placeholder="e.g. React, Node.js, MongoDB"
                value={p.techStack}
                onChange={(techStack) => updateProject(p.id, { techStack })}
              />
            </label>

            <BulletList
              bullets={p.bullets}
              onChange={(bullets) => updateProject(p.id, { bullets })}
              context={{ title: p.name, company: "" }}
            />

            <EntryControls
              index={idx}
              count={resume.projects.length}
              onMove={(to) => moveEntry("projects", idx, to)}
              onRemove={() => removeProject(p.id)}
              label="project"
              confirm={!!(p.name || p.bullets.some((b) => b.trim()))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
