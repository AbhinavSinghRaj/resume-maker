"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import Icon from "@/components/Icon";
import { confirmReplace } from "@/lib/resumeUtils";

export const MAX_UPLOAD_MB = 5;

export default function UploadResume() {
  const { resume, replaceResume } = useResumeStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`That file is over ${MAX_UPLOAD_MB} MB. Please upload a smaller PDF or DOCX.`);
      return;
    }
    if (!confirmReplace(resume, "Importing this file")) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      replaceResume(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Already have a resume?</h2>
      <p className="card-hint">Upload a PDF or DOCX (max {MAX_UPLOAD_MB} MB) and we&apos;ll fill in the form for you.</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="btn btn-ghost w-full"
      >
        {loading ? `Reading ${fileName}…` : "Upload existing resume"}
      </button>
      {error && <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
      <p className="mt-2 flex gap-1.5 items-start" style={{ fontSize: "0.72rem", color: "var(--ink-soft)" }}>
        <Icon name="lock" size={13} className="shrink-0 mt-px" /> Your resume is saved only in this browser. Uploaded files are sent to our AI just to read them and aren&apos;t stored.
      </p>
    </div>
  );
}
