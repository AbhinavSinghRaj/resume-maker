import Anthropic from "@anthropic-ai/sdk";
import { JDAnalysisSchema, type JDAnalysis } from "../schema";
import { z } from "zod";

const client = new Anthropic(); // ANTHROPIC_API_KEY env se
const MODEL = "claude-sonnet-5";

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

function parseJSON<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return schema.parse(JSON.parse(cleaned));
}

async function ask(system: string, user: string): Promise<string> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: user }],
  });
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
import { ResumeSchema, type Resume } from "../schema";

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
  return parseJSON(raw, ResumeSchema);
}