"use client";

import Link from "next/link";
import { useResumeStore } from "@/store/resumeStore";
import { getTemplate, templates } from "@/lib/templates";

/** Switch template right inside the builder; the full gallery is one click away. */
export default function TemplateGallery() {
  const { template, setTemplate } = useResumeStore();
  const cfg = getTemplate(template);

  return (
    <div className="card">
      <div className="card-row">
        <div>
          <h2 className="card-title">Template</h2>
          <p className="card-hint" style={{ marginBottom: 0 }}>{cfg.name} · {cfg.tagline}</p>
        </div>
        <Link href="/templates" className="btn btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
          See all
        </Link>
      </div>
      <div className="swatch-grid">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.name}
            aria-label={t.name}
            aria-pressed={t.id === template}
            onClick={() => setTemplate(t.id)}
            className="swatch"
            style={{ background: t.accent }}
          />
        ))}
      </div>
    </div>
  );
}
