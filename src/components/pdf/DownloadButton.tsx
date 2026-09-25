"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useResumeStore } from "@/store/resumeStore";
import ResumePDF from "./ResumePDF";

export default function DownloadButton() {
  const { resume } = useResumeStore();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.contact.fullName || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDownload} disabled={loading} className="btn btn-primary mb-4 w-full">
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}