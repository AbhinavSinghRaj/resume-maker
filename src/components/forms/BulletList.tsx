"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import Icon from "@/components/Icon";
import { moveItem } from "@/lib/resumeUtils";

interface Props {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  context: { title: string; company: string };
}

/** Bullet editor with AI "Improve" that previews the rewrite before applying it. */
export default function BulletList({ bullets, onChange, context }: Props) {
  const { jdAnalysis } = useResumeStore();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<{ index: number; text: string } | null>(null);
  const [error, setError] = useState<{ index: number; text: string } | null>(null);

  function update(index: number, value: string) {
    const next = [...bullets];
    next[index] = value;
    onChange(next);
  }

  function remove(index: number) {
    const next = bullets.filter((_, i) => i !== index);
    onChange(next.length ? next : [""]);
    setSuggestion(null);
  }

  function move(index: number, to: number) {
    onChange(moveItem(bullets, index, to));
    setSuggestion(null);
  }

  async function improve(index: number) {
    setLoadingIndex(index);
    setError(null);
    setSuggestion(null);
    try {
      const keywords = jdAnalysis?.keywordsWithVariants.map((k) => k.canonical) ?? [];
      const res = await fetch("/api/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: bullets[index], ...context, keywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't improve this bullet");
      setSuggestion({ index, text: data.bullet });
    } catch (e) {
      setError({ index, text: e instanceof Error ? e.message : "Couldn't improve this bullet" });
    } finally {
      setLoadingIndex(null);
    }
  }

  const small = { padding: "0.3rem 0.5rem", fontSize: "0.72rem" };

  return (
    <div className="grid gap-2">
      <span className="text-xs" style={{ color: "var(--ink-soft)" }}>Bullets</span>
      {bullets.map((b, i) => (
        <div key={i} className="grid gap-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <textarea
              rows={2}
              value={b}
              aria-label={`Bullet ${i + 1}`}
              onChange={(e) => update(i, e.target.value)}
              className="field flex-1"
            />
            <div className="flex flex-row sm:flex-col gap-1">
              <button
                type="button"
                onClick={() => improve(i)}
                disabled={loadingIndex === i || b.trim().length < 5}
                className="btn btn-add"
                style={small}
              >
                {loadingIndex === i ? "…" : <><Icon name="sparkle" size={14} /> Improve</>}
              </button>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="btn btn-ghost" style={small} aria-label="Move bullet up">↑</button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === bullets.length - 1} className="btn btn-ghost" style={small} aria-label="Move bullet down">↓</button>
              </div>
              <button type="button" onClick={() => remove(i)} className="btn-danger-text" style={{ fontSize: "0.72rem" }}>
                Remove
              </button>
            </div>
          </div>

          {suggestion?.index === i && (
            <div className="suggestion">
              <div className="suggestion-label">Suggested rewrite</div>
              <p>{suggestion.text}</p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={small}
                  onClick={() => {
                    update(i, suggestion.text);
                    setSuggestion(null);
                  }}
                >
                  Use this
                </button>
                <button type="button" className="btn btn-ghost" style={small} onClick={() => setSuggestion(null)}>
                  Keep mine
                </button>
              </div>
            </div>
          )}
          {error?.index === i && (
            <p className="text-xs" style={{ color: "var(--danger)" }}>{error.text}</p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...bullets, ""])}
        className="btn btn-ghost"
        style={{ fontSize: "0.78rem", justifySelf: "start" }}
      >
        + Add bullet
      </button>
    </div>
  );
}
