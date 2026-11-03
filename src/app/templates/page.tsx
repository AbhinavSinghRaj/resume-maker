"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { useResumeStore } from "@/store/resumeStore";
import { templates } from "@/lib/templates";
import { sampleResume } from "@/lib/sampleResume";
import { ResumeThumb } from "@/components/preview/ResumePreview";
import Icon from "@/components/Icon";

const filters = [
  { id: "all", label: "All" },
  { id: "single", label: "Single column" },
  { id: "sidebar", label: "Sidebar" },
  { id: "compact", label: "Compact" },
  { id: "serif", label: "Serif" },
  { id: "band", label: "Color header" },
] as const;

export default function TemplatesPage() {
  const router = useRouter();
  const { template, setTemplate } = useResumeStore();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  function choose(id: string) {
    setTemplate(id);
    router.push("/builder");
  }

  const shown = templates.filter((t) =>
    filter === "all" ? true
      : filter === "compact" ? t.density === "compact"
      : filter === "serif" ? t.font === "serif"
      : filter === "band" ? t.headerStyle === "band"
      : t.layout === filter
  );

  return (
    <>
      <SiteNav />
      <header className="app-header" style={{ paddingTop: "3rem" }}>
        <div className="app-shell">
          <span className="eyebrow">Templates</span>
          <h1 className="app-title" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>Pick a look you love.</h1>
          <p className="app-subtitle">{templates.length} styles, shown with a real sample resume. Every one exports a clean, ATS-safe PDF.</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1.4rem" }}>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`btn ${filter === f.id ? "btn-dark" : "btn-ghost"}`}
                style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem", borderRadius: "999px" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="app-shell" style={{ padding: "1.5rem 1.25rem 4rem", width: "100%" }}>
        <div className="tpl-grid">
          {shown.map((t) => {
            const selected = template === t.id;
            return (
              <div
                key={t.id}
                className="tpl-gallery-card card"
                style={{
                  marginBottom: 0,
                  padding: "0.9rem",
                  position: "relative",
                  borderColor: selected ? t.accent : "var(--rule)",
                  boxShadow: selected ? `0 0 0 3px ${t.accent}33` : undefined,
                }}
              >
                {selected && (
                  <span className="chip" style={{ position: "absolute", top: 18, right: 18, background: t.accent, color: "#fff", zIndex: 1 }}>
                    <Icon name="check" size={12} /> Selected
                  </span>
                )}
                <ResumeThumb resume={sampleResume} cfg={t} />
                <div className="mt-3 flex items-center gap-2">
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: t.accent, flexShrink: 0 }} />
                  <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{t.name}</div>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>{t.tagline}</div>
                <button
                  onClick={() => choose(t.id)}
                  className={`btn w-full mt-3 ${selected ? "btn-dark" : "btn-add"}`}
                  style={{ fontSize: "0.82rem" }}
                >
                  {selected ? "Continue editing →" : "Use this template"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
