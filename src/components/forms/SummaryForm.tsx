"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import Icon from "@/components/Icon";

export default function SummaryForm() {
  const { resume, jdAnalysis, setSummary } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");

  const summary = resume.summary ?? "";
  const words = summary.trim().split(/\s+/).filter(Boolean).length;
  const hasFacts = resume.experience.length > 0 || resume.projects.length > 0 || resume.skills.length > 0;

  async function improve() {
    setLoading(true);
    setError("");
    setSuggestion("");
    try {
      const keywords = jdAnalysis?.keywordsWithVariants.map((k) => k.canonical) ?? [];
      // Only send facts the summary should draw on, not contact details.
      const { contact: _contact, ...facts } = resume;
      void _contact;
      const res = await fetch("/api/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: facts, keywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't write a summary");
      setSuggestion(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't write a summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="summary" className="card anchor">
      <div className="card-row">
        <h2 className="card-title">Summary</h2>
        <button
          type="button"
          onClick={improve}
          disabled={loading || !hasFacts}
          title={hasFacts ? "Draft a summary from your experience, projects and skills" : "Add experience, projects or skills first"}
          className="btn btn-add"
        >
          <Icon name="sparkle" size={15} />
          {loading ? "Writing…" : summary ? "Improve" : "Write with AI"}
        </button>
      </div>
      <textarea
        aria-label="Summary"
        placeholder="2-3 sentences: who you are, your strongest skills, and what you've achieved."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={5}
        className="field"
      />
      <div className="mt-1 text-right" style={{ fontSize: "0.72rem", color: "var(--ink-soft)" }}>
        {words} words{words > 0 && (words < 30 || words > 80) ? " — aim for 30-80" : ""}
      </div>

      {suggestion && (
        <div className="suggestion mt-2">
          <div className="suggestion-label">Suggested summary</div>
          <p>{suggestion}</p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
              onClick={() => {
                setSummary(suggestion);
                setSuggestion("");
              }}
            >
              Use this
            </button>
            <button type="button" className="btn btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }} onClick={() => setSuggestion("")}>
              Keep mine
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
    </div>
  );
}
