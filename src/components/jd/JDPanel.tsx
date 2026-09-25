"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";

export default function JDPanel() {
  const { jdAnalysis, setJDAnalysis, masterProfile, setMasterProfile, setResume } = useResumeStore();
  const [jdText, setJdText] = useState("");
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
      setError(e instanceof Error ? e.message : "Kuch gadbad hui");
    } finally {
      setLoadingAnalyze(false);
    }
  }

  async function handleGenerate() {
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
      setResume(data);
      if (!jdAnalysis) await handleAnalyze();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kuch gadbad hui");
    } finally {
      setLoadingGenerate(false);
    }
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="card-title">1. Apna Master Profile likh</h2>
        <p className="card-hint">
          Apni saari companies, roles, projects, skills, education jaisa yaad aaye waisa likh de. Formatting ki tension mat le.
        </p>
        <textarea
          rows={7}
          placeholder="e.g. 8 years react/next.js developer, Crain Communications me contract pe kaam karta hu…"
          value={masterProfile}
          onChange={(e) => setMasterProfile(e.target.value)}
          className="field"
        />
      </div>

      <div className="mb-4">
        <h2 className="card-title">2. Job Description paste kar</h2>
        <p className="card-hint">Jis role ke liye resume banana hai, uski JD daal de.</p>
        <textarea
          rows={7}
          placeholder="Job description yahan paste kar…"
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
          {loadingGenerate ? "Resume generate ho raha hai…" : "Generate resume from this JD"}
        </button>

        <button
          onClick={handleAnalyze}
          disabled={loadingAnalyze || jdText.trim().length < 20}
          className="btn btn-ghost w-full"
        >
          {loadingAnalyze ? "Analyzing…" : "Sirf keyword match dekhna hai"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
      {jdAnalysis && (
        <p className="mt-2 text-sm" style={{ color: "var(--accent-strong)" }}>
          &quot;{jdAnalysis.jobTitle}&quot; ke {jdAnalysis.keywordsWithVariants.length} keywords mile.
        </p>
      )}
    </div>
  );
}