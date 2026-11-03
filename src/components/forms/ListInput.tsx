"use client";

import { useState } from "react";

const parse = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);

/**
 * Comma-separated list input. Keeps the raw text locally so typing "React, " doesn't
 * lose the trailing comma before the next item is typed.
 */
export default function ListInput({
  value,
  onChange,
  ...rest
}: { value: string[]; onChange: (items: string[]) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const [text, setText] = useState(value.join(", "));
  const [synced, setSynced] = useState(value);

  // Pick up outside changes (import, undo, "add keyword") without clobbering in-progress typing.
  if (value !== synced) {
    setSynced(value);
    if (parse(text).join("|") !== value.join("|")) setText(value.join(", "));
  }

  return (
    <input
      {...rest}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        const items = parse(e.target.value);
        setSynced(items);
        onChange(items);
      }}
      className={rest.className ?? "field"}
    />
  );
}
