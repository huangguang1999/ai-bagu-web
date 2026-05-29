import Link from "next/link";
import QuestionBrowser from "@/components/QuestionBrowser";
import { categories, questions } from "@/lib/questions";

export default function Home() {
  const stats = [
    { n: questions.length, label: "真实面试题" },
    { n: categories.length, label: "知识方向" },
    { n: "大白话", label: "零基础讲解" },
  ];
  return (
    <div>
      <section className="mb-9">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" />
          像刷 LeetCode 一样刷 AI 面试八股
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.6rem]">
          <span className="grad-text">AI 面试八股,讲成人话</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          {questions.length} 道真实 AI 面试题,配零基础也能看懂的大白话讲解。先自测、再看答案,
          进度存本地。题库还以 MCP / REST API 开放,可接入任意 AI agent。
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card px-4 py-2.5">
              <div className="text-xl font-bold text-[var(--text)]">{s.n}</div>
              <div className="text-xs text-[var(--faint)]">{s.label}</div>
            </div>
          ))}
          <Link
            href="/agent"
            className="card flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            🤖 接入你的 AI →
          </Link>
        </div>
      </section>

      <QuestionBrowser questions={questions} categories={categories} />
    </div>
  );
}
