"use client";

import { useState } from "react";
import type { Question } from "@/lib/questions";
import { useProgress } from "@/lib/progress";
import Markdown from "@/components/Markdown";

export default function AnswerPanel({ q }: { q: Question }) {
  const [shown, setShown] = useState(false);
  const { mastered, fav, toggleMastered, toggleFav } = useProgress();
  const isMastered = mastered.has(q.id);
  const isFav = fav.has(q.id);

  return (
    <div className="mt-6">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="w-full rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)] py-8 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          👀 点击查看大白话讲解 — 先自己想想怎么答
        </button>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
          <Markdown>{q.answer}</Markdown>
          {q.source && (
            <p className="mt-4 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
              题源:
              <a href={q.source.url} target="_blank" rel="noreferrer" className="ml-1 underline hover:text-[var(--text)]">
                {q.source.name}
              </a>
              　答案为 AI 辅助生成的大白话版,使用前请自行核对。
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => toggleMastered(q.id)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            isMastered
              ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-400"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          {isMastered ? "✓ 已掌握" : "标记为已掌握"}
        </button>
        <button
          onClick={() => toggleFav(q.id)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            isFav
              ? "border-amber-400/40 bg-amber-400/15 text-amber-400"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          {isFav ? "★ 已收藏" : "☆ 收藏"}
        </button>
      </div>
    </div>
  );
}
