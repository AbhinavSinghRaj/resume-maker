import { create } from "zustand";
import type {
  Resume,
  Experience,
  Education,
  SkillGroup,
  Project,
  Certification,
  JDAnalysis,
} from "@/lib/schema";

const emptyResume: Resume = {
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

  setAchievements: (items: string[]) => void;
  setLanguages: (items: string[]) => void;

  jdAnalysis: JDAnalysis | null;
  setJDAnalysis: (analysis: JDAnalysis | null) => void;
    masterProfile: string;
  setMasterProfile: (text: string) => void;
  setResume: (resume: Resume) => void;

}

export const useResumeStore = create<ResumeState>((set) => ({
  resume: emptyResume,
  jdAnalysis: null,
    masterProfile: "",
  setMasterProfile: (text: string) => set({ masterProfile: text }),
  setResume: (resume: Resume) => set({ resume }),

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

  setAchievements: (items) => set((s) => ({ resume: { ...s.resume, achievements: items } })),
  setLanguages: (items) => set((s) => ({ resume: { ...s.resume, languages: items } })),

  setJDAnalysis: (analysis) => set({ jdAnalysis: analysis }),
}));