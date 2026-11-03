"use client";

interface Props {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  label: string;
  /** Ask before removing (skip for empty entries). */
  confirm?: boolean;
}

/** Move up / move down / remove row shown at the bottom of each entry. */
export default function EntryControls({ index, count, onMove, onRemove, label, confirm = true }: Props) {
  const small = { padding: "0.3rem 0.6rem", fontSize: "0.75rem" };
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1">
        <button type="button" onClick={() => onMove(index - 1)} disabled={index === 0} className="btn btn-ghost" style={small} aria-label={`Move ${label} up`}>↑ Up</button>
        <button type="button" onClick={() => onMove(index + 1)} disabled={index === count - 1} className="btn btn-ghost" style={small} aria-label={`Move ${label} down`}>↓ Down</button>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!confirm || window.confirm(`Remove this ${label}? This can't be undone.`)) onRemove();
        }}
        className="btn-danger-text"
      >
        Remove {label}
      </button>
    </div>
  );
}
