"use client";

import { useState } from "react";
import type { Question } from "@/lib/questions";
import { useProgress } from "@/lib/progress";
import Markdown from "@/components/Markdown";

// 各段的强调色(按 emoji 标记)
const SECTION_ACCENT: Record<string, string> = {
  "💡": "var(--warn)",
  "🌰": "var(--accent-2)",
  "🔑": "var(--accent)",
  "🚀": "var(--ok)",
};

type Section = { emoji: string; title: string; body: string };

function parseSections(md: string): Section[] {
  const re = /\*\*\s*([💡🌰🔑🚀])\s*([^*]+?)\s*\*\*\s*\n?([\s\S]*?)(?=\n\s*\*\*\s*[💡🌰🔑🚀]|$)/g;
  const out: Section[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    out.push({ emoji: m[1], title: m[2].trim(), body: m[3].trim() });
  }
  return out;
}

export default function AnswerPanel({ q }: { q: Question }) {
  const [shown, setShown] = useState(false);
  const { mastered, fav, toggleMastered, toggleFav } = useProgress();
  const isMastered = mastered.has(q.id);
  const isFav = fav.has(q.id);
  const sections = parseSections(q.answer);

  return (
    <div className="mt-6">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="card group w-full py-9 text-center text-[var(--muted)] transition hover:border-[var(--accent)]"
        >
          <div className="text-2xl transition group-hover:scale-110">👀</div>
          <div className="mt-2 text-sm">点击查看大白话讲解</div>
          <div className="mt-1 text-xs text-[var(--faint)]">先自己想想怎么答,再对答案</div>
        </button>
      ) : (
        <div className="space-y-3">
          {sections.length > 0 ? (
            sections.map((s, i) => (
              <div
                key={i}
                className="card overflow-hidden p-4 pl-5"
                style={{ borderLeft: `3px solid ${SECTION_ACCENT[s.emoji] || "var(--accent)"}` }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-base">{s.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: SECTION_ACCENT[s.emoji] || "var(--text)" }}>
                    {s.title}
                  </span>
                </div>
                <Markdown>{s.body}</Markdown>
              </div>
            ))
          ) : (
            <div className="card p-5">
              <Markdown>{q.answer}</Markdown>
            </div>
          )}

          {q.source && (
            <p className="px-1 pt-1 text-xs text-[var(--faint)]">
              题源:
              <a href={q.source.url} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-[var(--muted)]">
                {q.source.name}
              </a>
              　答案为 AI 辅助生成的大白话版,使用前请自行核对。
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => toggleMastered(q.id)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            isMastered
              ? "border-[var(--ok)]/40 bg-[var(--ok)]/15 text-[var(--ok)]"
              : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--ok)]/50 hover:text-[var(--text)]"
          }`}
        >
          {isMastered ? "✓ 已掌握" : "标记为已掌握"}
        </button>
        <button
          onClick={() => toggleFav(q.id)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            isFav
              ? "border-[var(--warn)]/40 bg-[var(--warn)]/15 text-[var(--warn)]"
              : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--warn)]/50 hover:text-[var(--text)]"
          }`}
        >
          {isFav ? "★ 已收藏" : "☆ 收藏"}
        </button>
      </div>
    </div>
  );
}
