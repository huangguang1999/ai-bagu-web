import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerPanel from "@/components/AnswerPanel";
import { DIFFICULTY_COLORS, getQuestion, questions } from "@/lib/questions";

export function generateStaticParams() {
  return questions.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = getQuestion(id);
  return { title: q ? `${q.question} · AI 八股` : "题目未找到" };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = getQuestion(id);
  if (!q) notFound();

  const idx = questions.findIndex((x) => x.id === q.id);
  const prev = questions[idx - 1];
  const next = questions[idx + 1];

  return (
    <article>
      <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
        ← 返回题库
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded bg-[var(--panel)] px-2 py-1 text-[var(--muted)]">
          {q.category}
        </span>
        <span className={`rounded border px-2 py-1 ${DIFFICULTY_COLORS[q.difficulty]}`}>
          {q.difficulty}
        </span>
        <span className="text-[var(--muted)]">第 {q.index} 题</span>
      </div>

      <h1 className="mt-3 text-xl font-bold leading-relaxed sm:text-2xl">
        {q.question}
      </h1>

      <AnswerPanel q={q} />

      <nav className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5 text-sm">
        {prev ? (
          <Link href={`/q/${prev.id}`} className="max-w-[45%] text-[var(--muted)] hover:text-[var(--accent)]">
            <span className="line-clamp-1">← {prev.question}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/q/${next.id}`} className="max-w-[45%] text-right text-[var(--muted)] hover:text-[var(--accent)]">
            <span className="line-clamp-1">{next.question} →</span>
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
