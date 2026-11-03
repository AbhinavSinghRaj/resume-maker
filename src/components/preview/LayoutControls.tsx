"use client";

import { useResumeStore } from "@/store/resumeStore";
import { toggleableSections, type TextSize } from "@/lib/resumeUtils";

const sizes: { id: TextSize; label: string }[] = [
  { id: "s", label: "Small" },
  { id: "m", label: "Medium" },
  { id: "l", label: "Large" },
];

/** Text size and which sections appear on the resume (hiding keeps the data). */
export default function LayoutControls() {
  const { resume, hiddenSections, toggleSection, textSize, setTextSize } = useResumeStore();
  const options = [
    ...toggleableSections,
    ...(resume.customSections ?? [])
      .filter((c) => c.heading.trim())
      .map((c) => ({ id: c.id, label: c.heading })),
  ];
  const small = { padding: "0.3rem 0.7rem", fontSize: "0.75rem" };

  return (
    <div className="card grid gap-4">
      <div>
        <h2 className="card-title">Text size</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="Text size">
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={textSize === s.id}
              onClick={() => setTextSize(s.id)}
              className={`btn ${textSize === s.id ? "btn-primary" : "btn-ghost"}`}
              style={small}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="card-title">Show on resume</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {options.map((o) => (
            <label key={o.id} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--ink)" }}>
              <input
                type="checkbox"
                checked={!hiddenSections.includes(o.id)}
                onChange={() => toggleSection(o.id)}
              />
              {o.label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--ink-soft)" }}>
          Unticked sections are left out of the preview and PDF. Nothing is deleted.
        </p>
      </div>
    </div>
  );
}
