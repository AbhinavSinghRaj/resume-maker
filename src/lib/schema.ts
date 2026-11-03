import { z } from "zod";

// Dates hamesha "YYYY-MM" format me store karo. Display me "Jan 2024" banao.
// "present" allowed hai endDate ke liye.
const monthString = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM format");

export const ContactSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(), // "City, State, Country"
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  portfolio: z.string().url().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional(),
  startDate: monthString,
  endDate: z.union([monthString, z.literal("present")]),
  bullets: z.array(z.string().min(1)).min(1),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1), // "B.Tech"
  field: z.string().optional(), // "Computer Science"
  startDate: monthString.optional(),
  endDate: monthString.optional(),
  score: z.string().optional(), // "8.4 CGPA"
});

export const SkillGroupSchema = z.object({
  category: z.string().min(1), // "Languages", "Frameworks", "Tools"
  items: z.array(z.string().min(1)).min(1),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  url: z.string().url().optional(),
  techStack: z.array(z.string()).default([]),
  bullets: z.array(z.string().min(1)).min(1),
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string().optional(),
  date: monthString.optional(),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  heading: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
});

export const ResumeSchema = z.object({
  contact: ContactSchema,
  summary: z.string().optional(),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillGroupSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
// AI ke JD analysis ka output shape
export const JDAnalysisSchema = z.object({
  jobTitle: z.string(),
  hardSkills: z.array(z.string()), // React.js, TypeScript, AWS...
  softSkills: z.array(z.string()),
  keywordsWithVariants: z.array(
    z.object({
      canonical: z.string(), // "React.js"
      variants: z.array(z.string()), // ["ReactJS", "React"]
      importance: z.enum(["must", "good"]),
    })
  ),
  responsibilities: z.array(z.string()),
});

export type JDAnalysis = z.infer<typeof JDAnalysisSchema>;