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
    <article className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]">
        ← 返回题库
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md border border-[var(--border)] bg-[var(--panel)] px-2 py-0.5 text-[var(--muted)]">
          {q.category}
        </span>
        <span className={`rounded-md border px-2 py-0.5 font-medium ${DIFFICULTY_COLORS[q.difficulty]}`}>
          {q.difficulty}
        </span>
        <span className="text-[var(--faint)]">本类第 {q.index} 题</span>
      </div>

      <h1 className="mt-3 text-xl font-bold leading-snug sm:text-[1.6rem]">
        {q.question}
      </h1>

      <AnswerPanel q={q} />

      <nav className="mt-10 grid grid-cols-2 gap-3 border-t border-[var(--border-soft)] pt-6">
        {prev ? (
          <Link href={`/q/${prev.id}`} className="card p-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]">
            <div className="text-xs text-[var(--faint)]">← 上一题</div>
            <div className="mt-1 line-clamp-1">{prev.question}</div>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/q/${next.id}`} className="card p-3 text-right text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]">
            <div className="text-xs text-[var(--faint)]">下一题 →</div>
            <div className="mt-1 line-clamp-1">{next.question}</div>
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
