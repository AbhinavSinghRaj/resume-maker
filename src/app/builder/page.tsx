"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { Resume } from "@/lib/schema";
import ExperienceForm from "@/components/forms/ExperienceForm";
import EducationForm from "@/components/forms/EducationForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import AchievementsLanguagesForm from "@/components/forms/AchievementsLanguagesForm";
import ResumePreview from "@/components/preview/ResumePreview";
import ScorePanel from "@/components/ats/ScorePanel";
import DownloadButton from "@/components/pdf/DownloadButton";
import JDPanel from "@/components/jd/JDPanel";
import KeywordMatchPanel from "@/components/jd/KeywordMatchPanel";

const contactFields: { key: keyof Resume["contact"]; label: string; type?: string }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location (City, State, Country)" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "github", label: "GitHub URL" },
  { key: "portfolio", label: "Portfolio URL" },
];

export default function BuilderPage() {
  const { resume, setContact, setSummary } = useResumeStore();

  return (
    <>
      <header className="app-header">
        <div className="app-shell">
          <h1 className="app-title">Resume Builder</h1>
          <p className="app-subtitle">Write your story once. Tailor it to every job description.</p>
        </div>
      </header>

      <main className="app-shell grid grid-cols-1 gap-8 px-6 pt-6 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <JDPanel />

          <div className="card">
            <h2 className="card-title">Contact</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactFields.map((f) => (
                <label key={f.key} className="field-label">
                  {f.label}
                  <input
                    type={f.type ?? "text"}
                    value={resume.contact[f.key] ?? ""}
                    onChange={(e) => setContact(f.key, e.target.value)}
                    className="field"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Summary</h2>
            <textarea
              value={resume.summary ?? ""}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              className="field"
            />
          </div>

          <ExperienceForm />
          <EducationForm />
          <SkillsForm />
          <ProjectsForm />
          <CertificationsForm />
          <AchievementsLanguagesForm />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <KeywordMatchPanel />
          <DownloadButton />
          <ScorePanel />
          <ResumePreview />
        </div>
      </main>
    </>
  );
}