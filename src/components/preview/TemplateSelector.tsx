"use client";

import { useResumeStore } from "@/store/resumeStore";
import { templates } from "@/lib/templates";

export default function TemplateGallery() {
  const { template, setTemplate } = useResumeStore();

  return (
    <div className="card">
      <h2 className="card-title">Template</h2>
      <p className="card-hint">20 styles, same ATS-safe structure underneath.</p>
      <div className="grid grid-cols-2 gap-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
        {templates.map((t) => {
          const selected = template === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="rounded-lg border p-2 text-left"
              style={{
                borderColor: selected ? t.accent : "var(--rule)",
                borderWidth: selected ? "2px" : "1px",
                background: "#fff",
              }}
            >
              <div style={{ height: "6px", background: t.accent, borderRadius: "2px", marginBottom: "6px" }} />
              <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{t.name}</div>
              <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{t.tagline}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}