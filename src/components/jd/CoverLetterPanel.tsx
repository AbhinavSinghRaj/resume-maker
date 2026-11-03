"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";

export default function CoverLetterPanel() {
  const { masterProfile, jdText, coverLetter, setCoverLetter } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const ready = masterProfile.trim().length >= 30 && jdText.trim().length >= 20;

  async function handleGenerate() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterProfile, jdText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setCoverLetter(data.coverLetter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="card">
      <h2 className="card-title">Cover Letter</h2>
      <p className="card-hint">
        Written from your master profile and the job description above.
        {!ready && " Fill in both first."}
      </p>

      <button onClick={handleGenerate} disabled={loading || !ready} className="btn btn-primary w-full">
        {loading ? "Generating…" : coverLetter ? "Regenerate cover letter" : "Generate cover letter"}
      </button>

      {error && <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

      {coverLetter && (
        <div className="mt-3">
          <textarea
            rows={12}
            aria-label="Cover letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="field"
          />
          <button onClick={handleCopy} className="btn btn-ghost mt-2" style={{ fontSize: "0.8rem" }}>
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}
