"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Category, Question } from "@/lib/questions";
import { DIFFICULTY_COLORS } from "@/lib/questions";
import { useProgress } from "@/lib/progress";

const DIFFS = ["全部", "入门", "进阶", "挑战"];

export default function QuestionBrowser({
  questions,
  categories,
}: {
  questions: Question[];
  categories: Category[];
}) {
  const router = useRouter();
  const { mastered, fav, toggleFav } = useProgress();
  const [cat, setCat] = useState("全部");
  const [diff, setDiff] = useState("全部");
  const [kw, setKw] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [onlyTodo, setOnlyTodo] = useState(false);

  const filtered = useMemo(() => {
    const k = kw.trim().toLowerCase();
    return questions.filter((q) => {
      if (cat !== "全部" && q.categorySlug !== cat) return false;
      if (diff !== "全部" && q.difficulty !== diff) return false;
      if (onlyFav && !fav.has(q.id)) return false;
      if (onlyTodo && mastered.has(q.id)) return false;
      if (k && !q.question.toLowerCase().includes(k) &&
        !q.answer.toLowerCase().includes(k)) return false;
      return true;
    });
  }, [questions, cat, diff, kw, onlyFav, onlyTodo, fav, mastered]);

  const masteredCount = mastered.size;
  const pct = Math.round((masteredCount / questions.length) * 100);

  return (
    <div>
      {/* 顶部进度 + 随机 */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="flex-1">
          <div className="text-sm text-[var(--muted)]">
            已掌握 <span className="text-[var(--text)] font-semibold">{masteredCount}</span> / {questions.length} 题
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg)]">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            const pool = filtered.length ? filtered : questions;
            const q = pool[Math.floor(Math.random() * pool.length)];
            router.push(`/q/${q.id}`);
          }}
          className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
        >
          🎲 随机一题
        </button>
      </div>

      {/* 搜索 */}
      <input
        value={kw}
        onChange={(e) => setKw(e.target.value)}
        placeholder="搜索题目 / 答案关键词…"
        className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
      />

      {/* 分类筛选 */}
      <div className="mb-3 flex flex-wrap gap-2">
        <Chip active={cat === "全部"} onClick={() => setCat("全部")}>
          全部 {questions.length}
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
            {c.title} {c.count}
          </Chip>
        ))}
      </div>

      {/* 难度 + 过滤开关 */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {DIFFS.map((d) => (
          <Chip key={d} active={diff === d} onClick={() => setDiff(d)} small>
            {d}
          </Chip>
        ))}
        <span className="mx-1 text-[var(--border)]">|</span>
        <Chip active={onlyTodo} onClick={() => setOnlyTodo((v) => !v)} small>
          只看未掌握
        </Chip>
        <Chip active={onlyFav} onClick={() => setOnlyFav((v) => !v)} small>
          ★ 只看收藏
        </Chip>
      </div>

      {/* 列表 */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-[var(--muted)]">
            没有匹配的题目
          </div>
        )}
        {filtered.map((q, i) => (
          <div
            key={q.id}
            className={`flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 last:border-0 hover:bg-[var(--panel)] ${
              i % 2 ? "bg-[var(--bg)]" : "bg-[var(--panel)]/40"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                mastered.has(q.id)
                  ? "bg-emerald-400/20 text-emerald-400"
                  : "border border-[var(--border)] text-transparent"
              }`}
              title={mastered.has(q.id) ? "已掌握" : "未掌握"}
            >
              ✓
            </span>
            <Link href={`/q/${q.id}`} className="min-w-0 flex-1 hover:text-[var(--accent)]">
              <span className="line-clamp-1 text-sm">{q.question}</span>
            </Link>
            <span className="hidden shrink-0 text-xs text-[var(--muted)] sm:inline">
              {q.category}
            </span>
            <span
              className={`shrink-0 rounded border px-1.5 py-0.5 text-xs ${DIFFICULTY_COLORS[q.difficulty]}`}
            >
              {q.difficulty}
            </span>
            <button
              onClick={() => toggleFav(q.id)}
              className={`shrink-0 text-base ${fav.has(q.id) ? "text-amber-400" : "text-[var(--border)] hover:text-[var(--muted)]"}`}
              title="收藏"
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 ${small ? "py-1 text-xs" : "py-1.5 text-sm"} transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}
