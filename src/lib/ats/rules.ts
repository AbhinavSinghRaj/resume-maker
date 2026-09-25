import type { Resume, JDAnalysis } from "../schema";

export type Severity = "critical" | "warning" | "tip";

export interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
  severity: Severity;
  weight: number; // score me kitna contribute karta hai
  message: string; // fail hone pe user ko kya dikhana hai
}

const ACTION_VERBS = new Set([
  "built", "developed", "designed", "led", "managed", "created", "implemented",
  "optimized", "reduced", "increased", "improved", "launched", "migrated",
  "automated", "architected", "delivered", "integrated", "mentored", "owned",
  "scaled", "refactored", "shipped", "deployed", "analyzed", "streamlined",
]);

const STANDARD_HEADINGS = ["Experience", "Education", "Skills", "Projects"];

function allBullets(r: Resume): string[] {
  return [
    ...r.experience.flatMap((e) => e.bullets),
    ...r.projects.flatMap((p) => p.bullets),
  ];
}

function resumeText(r: Resume): string {
  return [
    r.summary ?? "",
    ...r.experience.map((e) => `${e.title} ${e.company} ${e.bullets.join(" ")}`),
    ...r.projects.map((p) => `${p.name} ${p.techStack.join(" ")} ${p.bullets.join(" ")}`),
    ...r.skills.flatMap((s) => s.items),
    ...r.certifications.map((c) => c.name),
  ]
    .join(" ")
    .toLowerCase();
}

export function runRuleChecks(r: Resume): CheckResult[] {
  const bullets = allBullets(r);
  const results: CheckResult[] = [];
  const add = (c: CheckResult) => results.push(c);

  // 1. Contact info
  const c = r.contact;
  const contactOk = !!(c.fullName && c.email && c.phone && c.location);
  add({
    id: "contact-complete",
    label: "Contact info complete",
    passed: contactOk,
    severity: "critical",
    weight: 10,
    message: "Name, email, phone aur location sab bharo. Ye body me jayega, header me nahi.",
  });

  add({
    id: "links-present",
    label: "LinkedIn / GitHub / portfolio",
    passed: !!(c.linkedin || c.github || c.portfolio),
    severity: "tip",
    weight: 3,
    message: "Kam se kam ek professional link (LinkedIn/GitHub) add karo.",
  });

  // 2. Required sections
  add({
    id: "experience-present",
    label: "Experience section present",
    passed: r.experience.length > 0 || r.projects.length > 0,
    severity: "critical",
    weight: 12,
    message: "Experience ya Projects section chahiye (freshers ke liye Projects).",
  });
  add({
    id: "education-present",
    label: "Education section present",
    passed: r.education.length > 0,
    severity: "critical",
    weight: 8,
    message: "Education section add karo.",
  });
  add({
    id: "skills-present",
    label: "Skills section present",
    passed: r.skills.flatMap((s) => s.items).length >= 5,
    severity: "critical",
    weight: 10,
    message: "Skills section me kam se kam 5 hard skills list karo.",
  });

  // 3. Summary
  const summaryWords = (r.summary ?? "").trim().split(/\s+/).filter(Boolean).length;
  add({
    id: "summary-length",
    label: "Summary 30-80 words",
    passed: summaryWords >= 30 && summaryWords <= 80,
    severity: "warning",
    weight: 5,
    message: `Summary ${summaryWords} words ka hai. 30-80 words ideal hai.`,
  });

  // 4. Bullet quality
  const startsWithVerb = bullets.filter((b) =>
    ACTION_VERBS.has(b.trim().split(/\s+/)[0]?.toLowerCase() ?? "")
  ).length;
  const verbRatio = bullets.length ? startsWithVerb / bullets.length : 0;
  add({
    id: "action-verbs",
    label: "Bullets start with action verbs",
    passed: verbRatio >= 0.8,
    severity: "warning",
    weight: 10,
    message: `${Math.round(verbRatio * 100)}% bullets action verb se shuru hote hain. 80%+ target karo.`,
  });

  const withNumbers = bullets.filter((b) => /\d/.test(b)).length;
  const numRatio = bullets.length ? withNumbers / bullets.length : 0;
  add({
    id: "quantified",
    label: "Bullets quantified (numbers/metrics)",
    passed: numRatio >= 0.5,
    severity: "warning",
    weight: 10,
    message: `${Math.round(numRatio * 100)}% bullets me numbers hain. Kam se kam 50% me % / count / time saved add karo.`,
  });

  const badLength = bullets.filter((b) => {
    const w = b.trim().split(/\s+/).length;
    return w < 8 || w > 30;
  }).length;
  add({
    id: "bullet-length",
    label: "Bullet length 8-30 words",
    passed: bullets.length > 0 && badLength / bullets.length <= 0.2,
    severity: "tip",
    weight: 4,
    message: `${badLength} bullets bahut chhote ya bade hain. 1-2 lines rakho.`,
  });

  // 5. Date consistency (schema already YYYY-MM enforce karta hai, yahan order/gap check)
  const dateIssue = r.experience.some(
    (e) => e.endDate !== "present" && e.endDate < e.startDate
  );
  add({
    id: "dates-valid",
    label: "Dates valid",
    passed: !dateIssue,
    severity: "critical",
    weight: 6,
    message: "Kisi role ka end date start date se pehle hai.",
  });

  // 6. Length
  const totalWords = resumeText(r).split(/\s+/).filter(Boolean).length;
  add({
    id: "length",
    label: "Length appropriate",
    passed: totalWords >= 250 && totalWords <= 900,
    severity: "warning",
    weight: 6,
    message: `Resume ~${totalWords} words ka hai. 250-900 (1-2 pages) ideal.`,
  });

  // 7. Reverse-chronological order
  const sorted = [...r.experience].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const orderOk = r.experience.every((e, i) => e.id === sorted[i].id);
  add({
    id: "reverse-chrono",
    label: "Experience in reverse-chronological order",
    passed: orderOk,
    severity: "warning",
    weight: 4,
    message: "Latest experience sabse upar rakho.",
  });

  return results;
}

export function computeScore(results: CheckResult[]): number {
  const total = results.reduce((s, r) => s + r.weight, 0);
  const got = results.filter((r) => r.passed).reduce((s, r) => s + r.weight, 0);
  return total ? Math.round((got / total) * 100) : 0;
}

// JD keyword matching: simple, deterministic. AI sirf variants generate karta hai.
export function keywordMatch(r: Resume, jd: JDAnalysis) {
  const text = resumeText(r);
  const matched: string[] = [];
  const missing: { keyword: string; importance: "must" | "good" }[] = [];

  for (const k of jd.keywordsWithVariants) {
    const forms = [k.canonical, ...k.variants].map((s) => s.toLowerCase());
    const found = forms.some((f) => text.includes(f));
    if (found) matched.push(k.canonical);
    else missing.push({ keyword: k.canonical, importance: k.importance });
  }

  const total = jd.keywordsWithVariants.length;
  return {
    matched,
    missing,
    matchPercent: total ? Math.round((matched.length / total) * 100) : 0,
  };
}