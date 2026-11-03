"use client";

import { useResumeStore } from "@/store/resumeStore";
import { sampleResume } from "@/lib/sampleResume";
import { hasContent } from "@/lib/resumeUtils";
import { useMounted } from "@/lib/useMounted";
import Icon, { type IconName } from "./Icon";

const options: { href: string; icon: IconName; title: string; hint: string }[] = [
  { href: "#import", icon: "upload", title: "Upload a resume", hint: "Import a PDF or DOCX you already have" },
  { href: "#jd", icon: "sparkle", title: "Generate from a JD", hint: "Write your profile, paste a job, let AI draft it" },
  { href: "#contact", icon: "pen", title: "Start from scratch", hint: "Fill in each section yourself" },
];

/** Shown only on an empty resume so first-time users know where to begin. */
export default function StartOptions() {
  const { resume, replaceResume } = useResumeStore();
  const mounted = useMounted();
  if (!mounted || hasContent(resume)) return null;

  return (
    <div className="card">
      <h2 className="card-title">How do you want to start?</h2>
      <p className="card-hint">Pick one. You can always edit everything afterwards.</p>
      <div className="start-grid">
        {options.map((o) => (
          <a key={o.href} href={o.href} className="start-card">
            <span className="start-icon"><Icon name={o.icon} /></span>
            <b>{o.title}</b>
            <span>{o.hint}</span>
          </a>
        ))}
        <button type="button" className="start-card" onClick={() => replaceResume(sampleResume)}>
          <span className="start-icon"><Icon name="eye" /></span>
          <b>Try a sample</b>
          <span>Load an example resume to see how it looks</span>
        </button>
      </div>
    </div>
  );
}
