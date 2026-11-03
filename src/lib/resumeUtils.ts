import type { Resume } from "./schema";

export function hasContent(r: Resume): boolean {
  return (
    Object.values(r.contact).some((v) => !!v?.trim()) ||
    !!r.summary?.trim() ||
    r.experience.length > 0 ||
    r.education.length > 0 ||
    r.skills.length > 0 ||
    r.projects.length > 0 ||
    r.certifications.length > 0 ||
    r.achievements.some((a) => !!a.trim()) ||
    (r.customSections ?? []).length > 0
  );
}

/** Asks before an action that would wipe what the user has typed. */
export function confirmReplace(r: Resume, action: string): boolean {
  if (!hasContent(r)) return true;
  return window.confirm(`${action} will replace your current resume. You can undo this afterwards. Continue?`);
}

export type TextSize = "s" | "m" | "l";
export const textScale: Record<TextSize, number> = { s: 0.9, m: 1, l: 1.1 };

/** Built-in sections the user can hide from the preview/PDF. Custom sections are toggled by their own id. */
export const toggleableSections = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "languages", label: "Languages" },
] as const;

/** The resume as it should be rendered: hidden sections emptied out, data otherwise untouched. */
export function visibleResume(r: Resume, hidden: string[]): Resume {
  if (!hidden.length) return r;
  const h = new Set(hidden);
  return {
    ...r,
    summary: h.has("summary") ? "" : r.summary,
    experience: h.has("experience") ? [] : r.experience,
    projects: h.has("projects") ? [] : r.projects,
    education: h.has("education") ? [] : r.education,
    skills: h.has("skills") ? [] : r.skills,
    certifications: h.has("certifications") ? [] : r.certifications,
    achievements: h.has("achievements") ? [] : r.achievements,
    languages: h.has("languages") ? [] : r.languages,
    customSections: (r.customSections ?? []).filter((c) => !h.has(c.id)),
  };
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
