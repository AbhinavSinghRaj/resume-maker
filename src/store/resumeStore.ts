import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Resume,
  Experience,
  Education,
  SkillGroup,
  Project,
  Certification,
  CustomSection,
  JDAnalysis,
} from "@/lib/schema";
import { moveItem, type TextSize } from "@/lib/resumeUtils";

type ListSection = "experience" | "education" | "skills" | "projects" | "certifications" | "customSections";

export const emptyResume: Resume = {
  contact: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  customSections: [],
};

interface ResumeState {
  resume: Resume;
  setContact: (field: keyof Resume["contact"], value: string) => void;
  setSummary: (value: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkillGroup: () => void;
  updateSkillGroup: (index: number, patch: Partial<SkillGroup>) => void;
  removeSkillGroup: (index: number) => void;

  addProject: () => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  addCustomSection: () => void;
  updateCustomSection: (id: string, patch: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  moveEntry: (section: ListSection, from: number, to: number) => void;

  addSkill: (skill: string) => void;

  setAchievements: (items: string[]) => void;
  setLanguages: (items: string[]) => void;

  jdAnalysis: JDAnalysis | null;
  setJDAnalysis: (analysis: JDAnalysis | null) => void;

  masterProfile: string;
  setMasterProfile: (text: string) => void;
  setResume: (resume: Resume) => void;

  // Snapshot taken before an upload/AI generation overwrites the resume, so it can be undone.
  previousResume: Resume | null;
  replaceResume: (resume: Resume) => void;
  undoReplace: () => void;
  dismissUndo: () => void;

  jdText: string;
  setJdText: (text: string) => void;

  template: string;
  setTemplate: (t: string) => void;
  coverLetter: string;
  setCoverLetter: (text: string) => void;

  // Section ids (or custom section ids) left out of the preview and PDF without deleting them.
  hiddenSections: string[];
  toggleSection: (id: string) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;

  resetAll: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: emptyResume,
      jdAnalysis: null,
      masterProfile: "",
      previousResume: null,
      jdText: "",
      template: "classic-teal",
      coverLetter: "",
      hiddenSections: [],
      textSize: "m",

      setContact: (field, value) =>
        set((s) => ({ resume: { ...s.resume, contact: { ...s.resume.contact, [field]: value } } })),
      setSummary: (value) =>
        set((s) => ({ resume: { ...s.resume, summary: value } })),

      addExperience: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: [
              ...s.resume.experience,
              {
                id: crypto.randomUUID(),
                company: "",
                title: "",
                location: "",
                startDate: "",
                endDate: "present",
                bullets: [""],
              },
            ],
          },
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          resume: { ...s.resume, experience: s.resume.experience.filter((e) => e.id !== id) },
        })),

      addEducation: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: [
              ...s.resume.education,
              {
                id: crypto.randomUUID(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                score: "",
              },
            ],
          },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: s.resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          resume: { ...s.resume, education: s.resume.education.filter((e) => e.id !== id) },
        })),

      addSkillGroup: () =>
        set((s) => ({ resume: { ...s.resume, skills: [...s.resume.skills, { category: "", items: [] }] } })),
      updateSkillGroup: (index, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            skills: s.resume.skills.map((sg, i) => (i === index ? { ...sg, ...patch } : sg)),
          },
        })),
      removeSkillGroup: (index) =>
        set((s) => ({ resume: { ...s.resume, skills: s.resume.skills.filter((_, i) => i !== index) } })),

      addProject: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: [
              ...s.resume.projects,
              { id: crypto.randomUUID(), name: "", url: "", techStack: [], bullets: [""] },
            ],
          },
        })),
      updateProject: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: s.resume.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({ resume: { ...s.resume, projects: s.resume.projects.filter((p) => p.id !== id) } })),

      addCertification: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: [
              ...s.resume.certifications,
              { id: crypto.randomUUID(), name: "", issuer: "", date: "" },
            ],
          },
        })),
      updateCertification: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: s.resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          resume: { ...s.resume, certifications: s.resume.certifications.filter((c) => c.id !== id) },
        })),

      // Older saved resumes may predate customSections, so default it everywhere.
      addCustomSection: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            customSections: [...(s.resume.customSections ?? []), { id: crypto.randomUUID(), heading: "", bullets: [""] }],
          },
        })),
      updateCustomSection: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            customSections: (s.resume.customSections ?? []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),
      removeCustomSection: (id) =>
        set((s) => ({
          resume: { ...s.resume, customSections: (s.resume.customSections ?? []).filter((c) => c.id !== id) },
        })),

      moveEntry: (section, from, to) =>
        set((s) => ({
          resume: { ...s.resume, [section]: moveItem<unknown>(s.resume[section] ?? [], from, to) },
        })),

      // Adds to the last skill group (or creates one) so missing JD keywords can be added in one click.
      addSkill: (skill) =>
        set((s) => {
          const skills = s.resume.skills.length
            ? s.resume.skills.map((g, i, arr) => (i === arr.length - 1 ? { ...g, items: [...g.items, skill] } : g))
            : [{ category: "Skills", items: [skill] }];
          return { resume: { ...s.resume, skills } };
        }),

      setAchievements: (items) => set((s) => ({ resume: { ...s.resume, achievements: items } })),
      setLanguages: (items) => set((s) => ({ resume: { ...s.resume, languages: items } })),

      setJDAnalysis: (analysis) => set({ jdAnalysis: analysis }),
      setMasterProfile: (text) => set({ masterProfile: text }),
      setResume: (resume) => set({ resume }),
      replaceResume: (resume) => set((s) => ({ previousResume: s.resume, resume })),
      undoReplace: () =>
        set((s) => (s.previousResume ? { resume: s.previousResume, previousResume: null } : {})),
      dismissUndo: () => set({ previousResume: null }),
      setJdText: (text) => set({ jdText: text }),
      setTemplate: (t) => set({ template: t }),
      setCoverLetter: (text) => set({ coverLetter: text }),
      toggleSection: (id) =>
        set((s) => ({
          hiddenSections: s.hiddenSections.includes(id)
            ? s.hiddenSections.filter((h) => h !== id)
            : [...s.hiddenSections, id],
        })),
      setTextSize: (size) => set({ textSize: size }),

      resetAll: () =>
        set((s) => ({
          resume: emptyResume,
          previousResume: s.resume,
          jdAnalysis: null,
          masterProfile: "",
          jdText: "",
          coverLetter: "",
          template: "classic-teal",
          hiddenSections: [],
          textSize: "m",
        })),
    }),
    {
      name: "resume-builder-storage",
    }
  )
);