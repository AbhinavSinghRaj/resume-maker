"use client";

import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import type { Resume } from "@/lib/schema";
import { getTemplate, type TemplateConfig } from "@/lib/templates";
import { textScale, visibleResume } from "@/lib/resumeUtils";

function formatMonth(m: string) {
  if (!m || m === "present") return "Present";
  const [y, mo] = m.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(mo, 10) - 1]} ${y}`;
}

function SectionTitle({ children, cfg }: { children: React.ReactNode; cfg: TemplateConfig }) {
  const style: Record<TemplateConfig["titleStyle"], React.CSSProperties> = {
    line: { borderBottom: `2px solid ${cfg.accent}`, paddingBottom: "2px" },
    filled: { background: cfg.accent, color: "#fff", padding: "2px 6px", borderRadius: "2px" },
    plain: { color: cfg.accent, letterSpacing: "0.08em" },
  };
  return <h2 className="mb-1 text-sm font-bold uppercase" style={style[cfg.titleStyle]}>{children}</h2>;
}

function MainContent({ resume, cfg }: { resume: Resume; cfg: TemplateConfig }) {
  return (
    <>
      {resume.summary && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Summary</SectionTitle>
          <p className="text-sm">{resume.summary}</p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Experience</SectionTitle>
          {resume.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm font-semibold">
                <span>{e.title} — {e.company}</span>
                <span className="text-gray-600">{formatMonth(e.startDate)} - {formatMonth(e.endDate)}</span>
              </div>
              {e.location && <div className="text-xs text-gray-600">{e.location}</div>}
              <ul className="mt-1 list-disc pl-5 text-sm">
                {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}
      {resume.projects.length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Projects</SectionTitle>
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="text-sm font-semibold">
                {p.name}{p.techStack.length > 0 && ` — ${p.techStack.join(", ")}`}
              </div>
              {p.url && <div className="text-xs text-gray-600">{p.url}</div>}
              <ul className="mt-1 list-disc pl-5 text-sm">
                {p.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Education</SectionTitle>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-2 flex flex-col sm:flex-row sm:justify-between text-sm">
              <span>
                {edu.degree}{edu.field && ` in ${edu.field}`} — {edu.institution}
                {edu.score && ` (${edu.score})`}
              </span>
              <span className="text-gray-600">
                {edu.startDate && formatMonth(edu.startDate)}{edu.endDate && ` - ${formatMonth(edu.endDate)}`}
              </span>
            </div>
          ))}
        </section>
      )}
      {(resume.customSections ?? []).filter((s) => s.heading.trim()).map((s) => (
        <section key={s.id} className="mb-4">
          <SectionTitle cfg={cfg}>{s.heading}</SectionTitle>
          <ul className="list-disc pl-5 text-sm">
            {s.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </section>
      ))}
    </>
  );
}

function SideContent({ resume, cfg }: { resume: Resume; cfg: TemplateConfig }) {
  return (
    <>
      {resume.skills.length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Skills</SectionTitle>
          {resume.skills.map((g, i) => (
            <div key={i} className="mb-1 text-sm">
              <span className="font-semibold">{g.category}: </span>
              {g.items.join(", ")}
            </div>
          ))}
        </section>
      )}
      {resume.certifications.length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Certifications</SectionTitle>
          {resume.certifications.map((c) => (
            <div key={c.id} className="text-sm">
              {c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${formatMonth(c.date)})`}
            </div>
          ))}
        </section>
      )}
      {resume.achievements.filter(Boolean).length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Achievements</SectionTitle>
          <ul className="list-disc pl-5 text-sm">
            {resume.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}
      {resume.languages.length > 0 && (
        <section className="mb-4">
          <SectionTitle cfg={cfg}>Languages</SectionTitle>
          <p className="text-sm">{resume.languages.join(", ")}</p>
        </section>
      )}
    </>
  );
}

const fonts = { serif: "Georgia, 'Times New Roman', serif", sans: "var(--font-sans), Helvetica, Arial, sans-serif" };

/** Pure render of a resume in a template. Used by the builder, the templates page and the landing page. */
export function ResumeDocument({ resume, cfg, scale = 1 }: { resume: Resume; cfg: TemplateConfig; scale?: number }) {
  const c = resume.contact;
  const band = cfg.headerStyle === "band";
  const pad = cfg.density === "compact" ? "clamp(1rem, 4vw, 1.75rem)" : "clamp(1.25rem, 5vw, 2.5rem)";

  const header = (
    <div
      className={`mb-4 ${cfg.headerAlign === "left" ? "text-left" : "text-center"}`}
      style={band ? { background: cfg.accent, color: "#fff", margin: `calc(-1 * ${pad}) calc(-1 * ${pad}) 1rem`, padding: pad } : undefined}
    >
      <h1 className="text-xl sm:text-2xl font-bold" style={{ color: band ? "#fff" : cfg.accent }}>{c.fullName || "Your Name"}</h1>
      <p className="text-sm" style={{ opacity: 0.85 }}>{[c.email, c.phone, c.location].filter(Boolean).join(" | ")}</p>
      <p className="text-sm" style={{ opacity: 0.85 }}>{[c.linkedin, c.github, c.portfolio].filter(Boolean).join(" | ")}</p>
    </div>
  );

  const wrapperStyle = {
    padding: pad,
    fontSize: cfg.density === "compact" ? "0.92em" : "1em",
    fontFamily: fonts[cfg.font],
    width: "100%",
    overflow: "hidden",
    "--resume-scale": scale,
  } as React.CSSProperties;

  return (
    <div className="resume-sheet mx-auto max-w-[700px] text-gray-900" style={wrapperStyle}>
      {header}
      {cfg.layout === "sidebar" ? (
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-[32%] rounded p-3" style={{ background: `${cfg.accent}1A` }}>
            <SideContent resume={resume} cfg={cfg} />
          </div>
          <div className="flex-1">
            <MainContent resume={resume} cfg={cfg} />
          </div>
        </div>
      ) : (
        <>
          <MainContent resume={resume} cfg={cfg} />
          <SideContent resume={resume} cfg={cfg} />
        </>
      )}
    </div>
  );
}

/** A small, non-interactive thumbnail of a resume, scaled to fit its container's width. */
export function ResumeThumb({ resume, cfg, height = 340 }: { resume: Resume; cfg: TemplateConfig; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.36);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setZoom(entry.contentRect.width / 700));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="resume-thumb" style={{ height }} aria-hidden>
      <div style={{ width: 700, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
        <ResumeDocument resume={resume} cfg={cfg} />
      </div>
    </div>
  );
}

export default function ResumePreview() {
  const { resume, template, hiddenSections, textSize } = useResumeStore();
  return <ResumeDocument resume={visibleResume(resume, hiddenSections)} cfg={getTemplate(template)} scale={textScale[textSize] ?? 1} />;
}
