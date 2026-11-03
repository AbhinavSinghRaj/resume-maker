"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function UndoBanner() {
  const { previousResume, undoReplace, dismissUndo } = useResumeStore();
  if (!previousResume) return null;

  return (
    <div className="undo-banner" role="status">
      <span>Your resume was replaced.</span>
      <button className="btn btn-dark" onClick={undoReplace}>Undo</button>
      <button className="btn-dismiss" onClick={dismissUndo} aria-label="Dismiss">✕</button>
    </div>
  );
}
