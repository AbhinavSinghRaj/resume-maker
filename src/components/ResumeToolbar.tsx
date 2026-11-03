"use client";

import { useRef, useState } from "react";
import { useResumeStore, emptyResume } from "@/store/resumeStore";
import type { Resume } from "@/lib/schema";
import { confirmReplace, hasContent } from "@/lib/resumeUtils";
import { useMounted } from "@/lib/useMounted";

/** Save status, backup/restore as JSON, and start-over controls for the builder. */
export default function ResumeToolbar() {
  const { resume, replaceResume, resetAll } = useResumeStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const filled = useMounted() && hasContent(resume);

  function exportJson() {
    const blob = new Blob([JSON.stringify({ version: 1, resume }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.contact.fullName || "resume"}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File) {
    setError("");
    try {
      const data = JSON.parse(await file.text());
      const r = (data?.resume ?? data) as Partial<Resume>;
      if (!r || typeof r !== "object" || !r.contact) throw new Error();
      if (!confirmReplace(resume, "Restoring this backup")) return;
      replaceResume({ ...emptyResume, ...r, contact: { ...emptyResume.contact, ...r.contact } });
    } catch {
      setError("That file isn't a valid resume backup.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-1">
      <div className="toolbar">
        {filled && <span className="save-status">✓ Saved in this browser</span>}
        <button className="btn btn-ghost" onClick={exportJson} disabled={!filled} title="Download a backup you can restore on any device">
          Back up
        </button>
        <button className="btn btn-ghost" onClick={() => inputRef.current?.click()} title="Restore from a backup file">
          Restore
        </button>
        <button
          className="btn-danger-text"
          disabled={!filled}
          onClick={() => {
            if (window.confirm("Clear everything and start over? You can undo this right after.")) resetAll();
          }}
        >
          Start over
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJson(f);
          }}
        />
      </div>
      {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
    </div>
  );
}
