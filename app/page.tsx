import QuestionBrowser from "@/components/QuestionBrowser";
import { categories, questions } from "@/lib/questions";

export default function Home() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          AI 面试八股,讲成人话 🧠
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {questions.length} 道真实 AI 面试题 · 零基础也能看懂的大白话讲解 ·
          像刷 LeetCode 一样刷八股。
        </p>
      </section>
      <QuestionBrowser questions={questions} categories={categories} />
    </div>
  );
}
