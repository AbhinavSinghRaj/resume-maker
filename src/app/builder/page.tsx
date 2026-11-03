"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { Resume } from "@/lib/schema";
import SummaryForm from "@/components/forms/SummaryForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import EducationForm from "@/components/forms/EducationForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import AchievementsLanguagesForm from "@/components/forms/AchievementsLanguagesForm";
import CustomSectionsForm from "@/components/forms/CustomSectionsForm";
import PreviewPanel from "@/components/preview/PreviewPanel";
import JDPanel from "@/components/jd/JDPanel";
import UploadResume from "@/components/jd/UploadResume";
import CoverLetterPanel from "@/components/jd/CoverLetterPanel";
import SiteNav from "@/components/SiteNav";
import UndoBanner from "@/components/UndoBanner";
import StartOptions from "@/components/StartOptions";
import ResumeToolbar from "@/components/ResumeToolbar";
import { useMounted } from "@/lib/useMounted";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { isValidEmail, isValidPhone, isValidUrl } from "@/components/forms/ContactValidation";

const contactFields: { key: keyof Resume["contact"]; label: string; type?: string; validate?: (v: string) => boolean; hint?: string }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email", type: "email", validate: isValidEmail, hint: "Enter a valid email like name@example.com" },
  { key: "phone", label: "Phone", validate: isValidPhone, hint: "Enter 7-15 digits, with optional spaces/dashes" },
  { key: "location", label: "Location (City, State, Country)" },
  { key: "linkedin", label: "LinkedIn URL", validate: isValidUrl, hint: "Enter a valid URL" },
  { key: "github", label: "GitHub URL", validate: isValidUrl, hint: "Enter a valid URL" },
  { key: "portfolio", label: "Portfolio URL", validate: isValidUrl, hint: "Enter a valid URL" },
];

const sections = [
  { id: "import", label: "Import" },
  { id: "contact", label: "Contact" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "more", label: "Certs & more" },
];

/** Which sections are filled in, shown as ticks in the section nav. */
function sectionDone(resume: Resume): Record<string, boolean> {
  return {
    contact: !!resume.contact.fullName && !!resume.contact.email && !!resume.contact.phone,
    summary: (resume.summary ?? "").trim().length > 0,
    experience: resume.experience.length > 0,
    education: resume.education.length > 0,
    skills: resume.skills.length > 0,
    projects: resume.projects.length > 0,
    more: resume.certifications.length > 0 || resume.achievements.some((a) => a.trim()) || resume.languages.length > 0,
  };
}

function completion(done: Record<string, boolean>) {
  const values = Object.values(done);
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

/** Highlights the section the user is currently looking at. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 180) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

const sectionIds = ["import", "contact", "summary", "experience", "education", "skills", "projects", "more"];

export default function BuilderPage() {
  const { resume, setContact } = useResumeStore();
  const mounted = useMounted();
  const done: Record<string, boolean> = mounted ? sectionDone(resume) : {};
  const pct = mounted ? completion(done) : 0;
  const active = useActiveSection(sectionIds);
  const firstName = mounted ? resume.contact.fullName.split(" ")[0] : "";
  // Only flag a contact field once the user has left it, not while they're still typing.
  const [touched, setTouched] = useState<Partial<Record<keyof Resume["contact"], boolean>>>({});

  return (
    <>
      <SiteNav />
      <header className="app-header builder-header">
        <div className="app-shell builder-hero">
          <div>
            <h1 className="app-title">
              {firstName ? `Hey ${firstName}, looking good` : "Let's build your resume"}
            </h1>
            <p className="app-subtitle">Write your story once. Tailor it to every job description.</p>
          </div>
          <div className="grid gap-2 justify-items-end">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink)" }}>{pct}% complete</span>
            </div>
            <ResumeToolbar />
          </div>
        </div>
      </header>
      <div className="topbar" style={{ top: "61px", zIndex: 30 }}>
        <div className="app-shell section-nav">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? "active" : ""}>
              {done[s.id] && <span className="nav-tick"><Icon name="check" size={11} /></span>}
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <main className="app-shell grid grid-cols-1 gap-8 px-4 sm:px-6 pt-6 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <StartOptions />
          <div id="import" className="anchor" />
          <UploadResume />
          <JDPanel />
          <CoverLetterPanel />

          <div id="contact" className="card anchor">
            <h2 className="card-title">Contact</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactFields.map((f) => {
                const value = resume.contact[f.key] ?? "";
                const valid = !touched[f.key] || !f.validate || f.validate(value);
                return (
                  <label key={f.key} className="field-label">
                    {f.label}
                    <input
                      type={f.type ?? "text"}
                      value={value}
                      onChange={(e) => setContact(f.key, e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                      aria-invalid={!valid}
                      className="field"
                      style={!valid ? { borderColor: "var(--danger)" } : undefined}
                    />
                    {!valid && (
                      <span style={{ color: "var(--danger)", fontSize: "0.72rem" }}>{f.hint}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <SummaryForm />

          <div id="experience" className="anchor" />
          <ExperienceForm />
          <div id="education" className="anchor" />
          <EducationForm />
          <div id="skills" className="anchor" />
          <SkillsForm />
          <div id="projects" className="anchor" />
          <ProjectsForm />
          <div id="more" className="anchor" />
          <CertificationsForm />
          <AchievementsLanguagesForm />
          <CustomSectionsForm />
        </div>

        <div id="preview" className="anchor preview-col lg:sticky lg:top-[120px] lg:self-start">
          <PreviewPanel />
        </div>
      </main>
      <a href="#preview" className="btn btn-dark preview-fab"><Icon name="eye" size={16} /> Preview</a>
      <UndoBanner />
    </>
  );
}