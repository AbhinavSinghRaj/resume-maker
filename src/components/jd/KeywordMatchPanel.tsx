"use client";

import { useMemo } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { keywordMatch } from "@/lib/ats/rules";

export default function KeywordMatchPanel() {
  const { resume, jdAnalysis } = useResumeStore();

  const match = useMemo(() => {
    if (!jdAnalysis) return null;
    return keywordMatch(resume, jdAnalysis);
  }, [resume, jdAnalysis]);

  if (!jdAnalysis || !match) return null;

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">JD Keyword Match</h2>
        <span className="font-display text-xl font-bold" style={{ color: "var(--accent-strong)" }}>
          {match.matchPercent}%
        </span>
      </div>

      {match.missing.length > 0 && (
        <div className="mb-2">
          <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>Missing keywords</h3>
          <div className="flex flex-wrap gap-1.5">
            {match.missing.map((m) => (
              <span key={m.keyword} className={`chip ${m.importance === "must" ? "chip-bad" : "chip-warn"}`}>
                {m.keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {match.matched.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>Matched</h3>
          <div className="flex flex-wrap gap-1.5">
            {match.matched.map((k) => (
              <span key={k} className="chip chip-good">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}