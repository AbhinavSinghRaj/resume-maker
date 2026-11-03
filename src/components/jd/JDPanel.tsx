"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { confirmReplace } from "@/lib/resumeUtils";

export default function JDPanel() {
  const { resume, jdAnalysis, setJDAnalysis, masterProfile, setMasterProfile, replaceResume, jdText, setJdText } =
    useResumeStore();
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");
    setLoadingAnalyze(true);
    try {
      const res = await fetch("/api/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setJDAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingAnalyze(false);
    }
  }

  async function handleGenerate() {
    if (!confirmReplace(resume, "Generating a resume")) return;
    setError("");
    setLoadingGenerate(true);
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterProfile, jdText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      replaceResume(data);
      if (!jdAnalysis) await handleAnalyze();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingGenerate(false);
    }
  }

  return (
    <div id="jd" className="card anchor">
      <div className="mb-4">
        <h2 className="card-title">1. Write your master profile</h2>
        <p className="card-hint">
          List every company, role, project, skill and degree you can remember — in your own words. Don&apos;t worry about formatting.
        </p>
        <textarea
          rows={7}
          aria-label="Master profile"
          placeholder="e.g. 8 years as a React/Next.js developer. Contract role at Acme since 2022, built the checkout flow…"
          value={masterProfile}
          onChange={(e) => setMasterProfile(e.target.value)}
          className="field"
        />
      </div>

      <div className="mb-4">
        <h2 className="card-title">2. Paste the job description</h2>
        <p className="card-hint">The posting for the role you&apos;re applying to.</p>
        <textarea
          rows={7}
          aria-label="Job description"
          placeholder="Paste the job description here…"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="field"
        />
      </div>

      <div className="grid gap-2">
        <button
          onClick={handleGenerate}
          disabled={loadingGenerate || masterProfile.trim().length < 30 || jdText.trim().length < 20}
          className="btn btn-primary w-full"
        >
          {loadingGenerate ? "Generating your resume…" : "Generate resume from this JD"}
        </button>

        <button
          onClick={handleAnalyze}
          disabled={loadingAnalyze || jdText.trim().length < 20}
          className="btn btn-ghost w-full"
        >
          {loadingAnalyze ? "Analyzing…" : "Just check keyword match"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
      {jdAnalysis && (
        <p className="mt-2 text-sm" style={{ color: "var(--accent-strong)" }}>
          Found {jdAnalysis.keywordsWithVariants.length} keywords for &quot;{jdAnalysis.jobTitle}&quot;.
        </p>
      )}
    </div>
  );
}
