"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { renderResumePdf } from "./renderPdf";
import Icon from "@/components/Icon";

export default function DownloadButton() {
  const { resume, template, hiddenSections, textSize } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState("");

  // Re-render the PDF in the background after edits settle so the page count stays live.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { pages } = await renderResumePdf({ resume, template, hiddenSections, textSize });
        if (!cancelled) setPages(pages);
      } catch {
        // Only a hint; the download button reports real failures.
      }
    }, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [resume, template, hiddenSections, textSize]);

  async function handleDownload() {
    setLoading(true);
    setError("");
    try {
      const { blob, pages } = await renderResumePdf({ resume, template, hiddenSections, textSize });
      setPages(pages);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(resume.contact.fullName || "resume").trim().replace(/\s+/g, "_")}_Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("Couldn't create the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="download-bar">
      <div className="text-xs" style={{ color: pages > 1 ? "#9A5B00" : "var(--ink-soft)" }}>
        {error ? (
          <span style={{ color: "var(--danger)" }}>{error}</span>
        ) : pages > 1 ? (
          <>Your resume is {pages} pages. Under 10 years of experience, aim for one: try a smaller text size, hide a section, or trim older bullets.</>
        ) : pages === 1 ? (
          <span className="inline-flex items-center gap-1" style={{ color: "var(--good)" }}><Icon name="check" size={14} /> Fits on 1 page</span>
        ) : (
          "A4 · text-selectable PDF"
        )}
      </div>
      <button onClick={handleDownload} disabled={loading} className="btn btn-primary">
        <Icon name="download" size={16} />
        {loading ? "Generating…" : "Download PDF"}
      </button>
    </div>
  );
}
