"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
export default function SkillsInput({
  value = [],
  onChange,
  placeholder = "Type a skill...",
}) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim();
    if (v && !value.some((x) => x.toLowerCase() === v.toLowerCase()))
      onChange([...value, v]);
    setText("");
  };
  return (
    <div>
      <div className="flex gap-2">
        <input
          className="field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          className="purple-btn flex items-center gap-1"
          onClick={add}
        >
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((x, i) => (
          <span className="tag" key={x + i}>
            {x}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
