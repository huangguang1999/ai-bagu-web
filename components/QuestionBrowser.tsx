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
      {/* 进度 + 随机 */}
      <div className="card mb-5 flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-[180px] flex-1">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-[var(--muted)]">学习进度</span>
            <span className="text-[var(--faint)]">
              <span className="font-semibold text-[var(--ok)]">{masteredCount}</span>
              {" "}/ {questions.length} 已掌握
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bg)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--ok)] to-[#5ee0a8] transition-all duration-500"
              style={{ width: `${Math.max(pct, 2)}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            const pool = filtered.length ? filtered : questions;
            const q = pool[Math.floor(Math.random() * pool.length)];
            router.push(`/q/${q.id}`);
          }}
          className="rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/20 transition hover:brightness-110 active:scale-[0.98]"
        >
          🎲 随机一题
        </button>
      </div>

      {/* 搜索 */}
      <div className="relative mb-4">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--faint)]">🔍</span>
        <input
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索题目 / 答案关键词…"
          className="card w-full py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
        />
      </div>

      {/* 分类筛选 */}
      <div className="mb-3 flex flex-wrap gap-2">
        <Chip active={cat === "全部"} onClick={() => setCat("全部")}>
          全部 <span className="opacity-60">{questions.length}</span>
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
            {c.title} <span className="opacity-60">{c.count}</span>
          </Chip>
        ))}
      </div>

      {/* 难度 + 过滤 */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {DIFFS.map((d) => (
          <Chip key={d} active={diff === d} onClick={() => setDiff(d)} small>{d}</Chip>
        ))}
        <span className="mx-1 h-4 w-px bg-[var(--border)]" />
        <Chip active={onlyTodo} onClick={() => setOnlyTodo((v) => !v)} small>只看未掌握</Chip>
        <Chip active={onlyFav} onClick={() => setOnlyFav((v) => !v)} small>★ 只看收藏</Chip>
        <span className="ml-auto self-center text-xs text-[var(--faint)]">{filtered.length} 题</span>
      </div>

      {/* 列表 */}
      <div className="card overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-[var(--muted)]">没有匹配的题目,换个筛选试试</div>
        )}
        {filtered.map((q, i) => (
          <div
            key={q.id}
            className="group flex items-center gap-3 border-b border-[var(--border-soft)] px-3 py-3 transition last:border-0 hover:bg-white/[0.03] sm:px-4"
          >
            <span className="w-5 shrink-0 text-right text-xs tabular-nums text-[var(--faint)]">{i + 1}</span>
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${
                mastered.has(q.id)
                  ? "bg-[var(--ok)]/15 text-[var(--ok)]"
                  : "border border-[var(--border)] text-transparent"
              }`}
              title={mastered.has(q.id) ? "已掌握" : "未掌握"}
            >
              ✓
            </span>
            <Link href={`/q/${q.id}`} className="min-w-0 flex-1 text-sm text-[var(--text)] transition group-hover:text-[var(--accent)]">
              <span className="line-clamp-1">{q.question}</span>
            </Link>
            <span className="hidden shrink-0 text-xs text-[var(--faint)] md:inline">{q.category}</span>
            <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${DIFFICULTY_COLORS[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <button
              onClick={() => toggleFav(q.id)}
              className={`shrink-0 text-base transition ${fav.has(q.id) ? "text-[var(--warn)]" : "text-[var(--border)] hover:text-[var(--muted)]"}`}
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
      className={`rounded-full border px-3 transition ${small ? "py-1 text-xs" : "py-1.5 text-[13px]"} ${
        active
          ? "border-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] font-medium text-white"
          : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--faint)] hover:text-[var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}
