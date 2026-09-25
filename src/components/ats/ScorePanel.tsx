"use client";

import { useMemo } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { runRuleChecks, computeScore } from "@/lib/ats/rules";

export default function ScorePanel() {
  const { resume } = useResumeStore();

  const results = useMemo(() => runRuleChecks(resume), [resume]);
  const score = useMemo(() => computeScore(results), [results]);

  const failed = results.filter((r) => !r.passed);
  const passed = results.filter((r) => r.passed);

  return (
    <div className="card">
      <div className="card-row" style={{ alignItems: "center" }}>
        <div>
          <h2 className="card-title">ATS Score</h2>
          <p className="card-hint" style={{ marginBottom: 0 }}>Deterministic checks, no AI guesswork.</p>
        </div>
        <div className="score-seal">
          <span className="num">{score}</span>
          <span className="of">out of 100</span>
        </div>
      </div>

      {failed.length > 0 && (
        <div className="mb-3">
          <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>Fix karna hai</h3>
          {failed.map((r) => (
            <div key={r.id} className="check-row">
              <span
                className="dot"
                style={{
                  color:
                    r.severity === "critical" ? "var(--danger)" : r.severity === "warning" ? "var(--gold)" : "var(--accent)",
                }}
              >
                ●
              </span>
              <span>{r.message}</span>
            </div>
          ))}
        </div>
      )}

      {passed.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>Pass ho gaya</h3>
          {passed.map((r) => (
            <div key={r.id} className="check-row" style={{ color: "var(--accent-strong)" }}>
              <span className="dot">✓</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}