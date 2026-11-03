"use client";

import { useMemo, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { runRuleChecks, computeScore } from "@/lib/ats/rules";
import ResumePreview from "./ResumePreview";
import TemplateGallery from "./TemplateGallery";
import LayoutControls from "./LayoutControls";
import ScorePanel from "@/components/ats/ScorePanel";
import KeywordMatchPanel from "@/components/jd/KeywordMatchPanel";
import DownloadButton from "@/components/pdf/DownloadButton";
import Icon, { type IconName } from "@/components/Icon";
import { useMounted } from "@/lib/useMounted";

const tabs: { id: string; label: string; icon: IconName }[] = [
  { id: "preview", label: "Preview", icon: "eye" },
  { id: "score", label: "ATS score", icon: "chart" },
  { id: "keywords", label: "Keywords", icon: "target" },
  { id: "design", label: "Design", icon: "palette" },
];

/** Right-hand column of the builder: download always visible, everything else in tabs. */
export default function PreviewPanel() {
  const { resume, jdAnalysis } = useResumeStore();
  const mounted = useMounted();
  const [tab, setTab] = useState("preview");
  const score = useMemo(() => computeScore(runRuleChecks(resume)), [resume]);

  return (
    <>
      <DownloadButton />
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="tab"
          >
            <Icon name={t.icon} size={15} />
            {t.label}
            {t.id === "score" && mounted && <span className="tab-badge">{score}</span>}
          </button>
        ))}
      </div>

      {tab === "preview" && <ResumePreview />}
      {tab === "score" && <ScorePanel />}
      {tab === "keywords" &&
        (jdAnalysis ? (
          <KeywordMatchPanel />
        ) : (
          <div className="card text-sm" style={{ color: "var(--ink-soft)" }}>
            Paste a job description in the <a href="#jd" className="check-link">Job description</a> panel to see which keywords you match.
          </div>
        ))}
      {tab === "design" && (
        <>
          <TemplateGallery />
          <LayoutControls />
        </>
      )}
    </>
  );
}
