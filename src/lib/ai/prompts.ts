import Anthropic from "@anthropic-ai/sdk";
import { JDAnalysisSchema, type JDAnalysis } from "../schema";
import { z } from "zod";

const client = new Anthropic(); // ANTHROPIC_API_KEY env se
const MODEL = "claude-sonnet-5-5";

// ---------- Prompts ----------

export const JD_ANALYSIS_SYSTEM = `You extract structured data from job descriptions for an ATS resume tool.
Respond with ONLY valid JSON. No markdown fences, no commentary.

Schema:
{
  "jobTitle": string,
  "hardSkills": string[],
  "softSkills": string[],
  "keywordsWithVariants": [{ "canonical": string, "variants": string[], "importance": "must" | "good" }],
  "responsibilities": string[]
}

Rules:
- "must" = explicitly required / repeated / in the requirements section. "good" = nice-to-have.
- variants = how ATS or recruiters may write the same term (e.g. React.js -> ["ReactJS", "React"]).
- Only include terms actually present or clearly implied by the JD. Do not invent.`;

export const BULLET_REWRITE_SYSTEM = `You rewrite resume bullets to be ATS-friendly and impactful.
Respond with ONLY valid JSON: { "bullets": string[] } with the same number of items as the input.

Rules:
- Start with a strong past-tense action verb (present tense for the current role).
- Structure: action + what you did + measurable result.
- Naturally include the provided target keywords ONLY where they are truthful for that bullet.
- NEVER invent numbers, metrics, tools, employers, or achievements. If the input has no metric,
  keep the bullet metric-free and add a "needsMetric" hint instead of making one up.
- 12-25 words per bullet. No first person ("I"). No buzzword fluff.
- Keep the original meaning.`;

export const SUMMARY_SYSTEM = `You write a 40-70 word professional resume summary.
Respond with ONLY valid JSON: { "summary": string }.
Use only facts present in the provided resume data. Include 3-5 of the target keywords if truthful.
No first person pronouns, no clichés like "hard-working" or "passionate".`;

// ---------- Helpers ----------

// The model sometimes adds a note after the JSON, so take only the first complete {...} object.
function extractJSONObject(raw: string): string {
  const start = raw.indexOf("{");
  if (start === -1) return raw;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return raw.slice(start, i + 1);
  }
  return raw.slice(start);
}

function parseJSON<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return schema.parse(JSON.parse(extractJSONObject(cleaned)));
}

async function ask(system: string, user: string): Promise<string> {
  // Sonnet 5.5 always thinks, and thinking counts toward max_tokens — keep headroom so JSON isn't cut off.
  // `fallbacks: "default"` lets the API retry on another model if this one declines the request.
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages: [{ role: "user", content: user }],
  });
  if (res.stop_reason === "refusal") throw new Error("The AI declined this request");
  if (res.stop_reason === "max_tokens") throw new Error("The AI response was cut off");
  return res.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
}

export async function analyzeJD(jdText: string): Promise<JDAnalysis> {
  const raw = await ask(JD_ANALYSIS_SYSTEM, `Job description:\n\n${jdText}`);
  return parseJSON(raw, JDAnalysisSchema);
}

export async function rewriteBullets(
  bullets: string[],
  context: { title: string; company: string },
  targetKeywords: string[]
): Promise<string[]> {
  const raw = await ask(
    BULLET_REWRITE_SYSTEM,
    JSON.stringify({ role: context, targetKeywords, bullets })
  );
  const out = parseJSON(raw, z.object({ bullets: z.array(z.string()) }));
  return out.bullets.length === bullets.length ? out.bullets : bullets;
}

export async function generateSummary(
  resumeFacts: unknown,
  targetKeywords: string[]
): Promise<string> {
  const raw = await ask(
    SUMMARY_SYSTEM,
    JSON.stringify({ resume: resumeFacts, targetKeywords })
  );
  return parseJSON(raw, z.object({ summary: z.string() })).summary;
}
import {
  ResumeSchema,
  ContactSchema,
  ExperienceSchema,
  EducationSchema,
  ProjectSchema,
  CertificationSchema,
  SkillGroupSchema,
  CustomSectionSchema,
  type Resume,
} from "../schema";

// The prompt tells the model to leave unknown fields as "", but the form schema rejects
// empty emails, URLs and dates. For AI output, drop empty strings and relax those formats;
// the builder's own validation still flags them for the user to fill in.
function dropEmptyStrings(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(dropEmptyStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== "")
        .map(([k, v]) => [k, dropEmptyStrings(v)])
    );
  }
  return value;
}

const looseUrl = z.string().optional();
const looseDate = z.string().optional();
// The model may leave a role with no bullets when the profile has no details for it.
const looseList = z.array(z.string()).default([]);
// A missing name or title is left blank for the user to fill in rather than failing the whole resume.
const looseText = z.string().default("");

const AIResumeSchema = z.preprocess(
  dropEmptyStrings,
  ResumeSchema.extend({
    contact: ContactSchema.extend({
      fullName: looseText,
      email: looseText,
      linkedin: looseUrl,
      github: looseUrl,
      portfolio: looseUrl,
    }),
    experience: z
      .array(
        ExperienceSchema.extend({
          company: looseText,
          title: looseText,
          startDate: looseText,
          endDate: looseText,
          bullets: looseList,
        })
      )
      .default([]),
    education: z.array(EducationSchema.extend({ institution: looseText, degree: looseText, startDate: looseDate, endDate: looseDate })).default([]),
    projects: z.array(ProjectSchema.extend({ name: looseText, url: looseUrl, bullets: looseList })).default([]),
    skills: z.array(SkillGroupSchema.extend({ category: looseText, items: looseList })).default([]),
    customSections: z.array(CustomSectionSchema.extend({ heading: looseText, bullets: looseList })).default([]),
    certifications: z.array(CertificationSchema.extend({ name: looseText, date: looseDate })).default([]),
  })
) as unknown as z.ZodType<Resume>;

export const GENERATE_RESUME_SYSTEM = `You build a complete ATS-optimized resume in JSON, using ONLY facts from the candidate's master profile.
Respond with ONLY valid JSON matching this shape (all fields required, use empty arrays/strings if unknown):
{
  "contact": {"fullName","email","phone","location","linkedin","github","portfolio"},
  "summary": string,
  "experience": [{"id","company","title","location","startDate":"YYYY-MM","endDate":"YYYY-MM or present","bullets":[string]}],
  "education": [{"id","institution","degree","field","startDate","endDate","score"}],
  "skills": [{"category","items":[string]}],
  "projects": [{"id","name","url","techStack":[string],"bullets":[string]}],
  "certifications": [{"id","name","issuer","date"}],
  "achievements": [string],
  "languages": [string],
  "customSections": []
}

CRITICAL RULES:
- NEVER invent employers, dates, metrics, tools, or achievements not present in the master profile.
- Select and prioritize the profile's real experience/skills/projects most relevant to the target job description.
- Rewrite bullets: action verb + what was done + result, naturally including the JD's real keywords ONLY where truthful.
- If a fact is missing (e.g. no phone number), leave that field empty. Do not fabricate.
- Reorder skills so JD-relevant ones appear first within each category.
- Generate ids as short random strings.`;

export async function generateResumeFromProfile(
  masterProfile: string,
  jdText: string
): Promise<Resume> {
  const raw = await ask(
    GENERATE_RESUME_SYSTEM,
    JSON.stringify({ masterProfile, jobDescription: jdText })
  );
  return parseJSON(raw, AIResumeSchema);
}
export const PARSE_RESUME_SYSTEM = `You convert raw resume text (extracted from a PDF/DOCX, possibly messy with broken line breaks) into structured JSON.
Respond with ONLY valid JSON matching this shape:
{
  "contact": {"fullName","email","phone","location","linkedin","github","portfolio"},
  "summary": string,
  "experience": [{"id","company","title","location","startDate":"YYYY-MM","endDate":"YYYY-MM or present","bullets":[string]}],
  "education": [{"id","institution","degree","field","startDate","endDate","score"}],
  "skills": [{"category","items":[string]}],
  "projects": [{"id","name","url","techStack":[string],"bullets":[string]}],
  "certifications": [{"id","name","issuer","date"}],
  "achievements": [string],
  "languages": [string],
  "customSections": []
}

Rules:
- Extract only what's actually in the text. Never invent dates, numbers, or employers.
- If a date is ambiguous or missing, leave the field empty rather than guessing.
- Generate ids as short random strings.
- Preserve the original bullet wording as closely as possible — this is extraction, not rewriting.`;

export async function parseResumeText(rawText: string): Promise<Resume> {
  const raw = await ask(PARSE_RESUME_SYSTEM, rawText.slice(0, 15000));
  return parseJSON(raw, AIResumeSchema);
}

export const COVER_LETTER_SYSTEM = `You write a professional cover letter using ONLY facts from the candidate's master profile, tailored to the job description.
Respond with ONLY valid JSON: { "coverLetter": string }

Rules:
- 250-350 words, 3-4 paragraphs: opening hook, relevant experience tied to the JD, why this role/company, closing.
- Use ONLY facts, companies, and projects present in the master profile. Never invent achievements or numbers.
- Reference 2-3 of the JD's real keywords naturally, only where truthful.
- Professional but not stiff. No generic filler like "I am writing to express my interest."
- Do not include a header/address block or "Dear Hiring Manager" salutation placeholder details you don't have — just start with "Dear Hiring Manager," and end with "Sincerely," followed by the candidate's name from the profile.`;

export async function generateCoverLetter(masterProfile: string, jdText: string): Promise<string> {
  const raw = await ask(
    COVER_LETTER_SYSTEM,
    JSON.stringify({ masterProfile, jobDescription: jdText })
  );
  const out = parseJSON(raw, z.object({ coverLetter: z.string() }));
  return out.coverLetter;
}