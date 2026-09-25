"use client";

import { useResumeStore } from "@/store/resumeStore";

function formatMonth(m: string) {
  if (!m || m === "present") return "Present";
  const [y, mo] = m.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(mo, 10) - 1]} ${y}`;
}

export default function ResumePreview() {
  const { resume } = useResumeStore();
  const c = resume.contact;

  return (
    <div className="resume-sheet mx-auto max-w-[700px] p-10 text-gray-900">
      <div className="mb-4 text-center">
        <h1 className="font-display text-2xl font-bold">{c.fullName || "Your Name"}</h1>
        <p className="text-sm text-gray-700">
          {[c.email, c.phone, c.location].filter(Boolean).join(" | ")}
        </p>
        <p className="text-sm text-gray-700">
          {[c.linkedin, c.github, c.portfolio].filter(Boolean).join(" | ")}
        </p>
      </div>

      {resume.summary && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Summary</h2>
          <p className="text-sm">{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Experience</h2>
          {resume.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>{e.title} — {e.company}</span>
                <span className="text-gray-600">
                  {formatMonth(e.startDate)} - {formatMonth(e.endDate)}
                </span>
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
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Projects</h2>
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="text-sm font-semibold">
                {p.name}{p.techStack.length > 0 && ` — ${p.techStack.join(", ")}`}
              </div>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {p.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-2 flex justify-between text-sm">
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

      {resume.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Skills</h2>
          {resume.skills.map((g, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold">{g.category}: </span>
              {g.items.join(", ")}
            </div>
          ))}
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Certifications</h2>
          {resume.certifications.map((c) => (
            <div key={c.id} className="text-sm">
              {c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${formatMonth(c.date)})`}
            </div>
          ))}
        </section>
      )}

      {resume.achievements.filter(Boolean).length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Achievements</h2>
          <ul className="list-disc pl-5 text-sm">
            {resume.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {resume.languages.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-gray-300 text-sm font-bold uppercase">Languages</h2>
          <p className="text-sm">{resume.languages.join(", ")}</p>
        </section>
      )}
    </div>
  );
}