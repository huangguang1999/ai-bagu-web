// 题库数据访问层。questions.json / categories.json 由 scripts/sync-questions.mjs 生成。
import questionsData from "@/data/questions.json";
import categoriesData from "@/data/categories.json";

export type Source = { name: string; url: string } | null;

export type Question = {
  id: string;
  category: string;
  categorySlug: string;
  categoryOrder: number;
  index: number;
  difficulty: string;
  question: string;
  answer: string;
  source: Source;
};

export type Category = {
  title: string;
  slug: string;
  order: number;
  intro: string;
  source: Source;
  count: number;
  difficulty: string;
};

export const questions = questionsData as Question[];
export const categories = categoriesData as Category[];

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getByCategory(slug: string): Question[] {
  return questions.filter((q) => q.categorySlug === slug);
}

export function searchQuestions(keyword: string): Question[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return [];
  return questions.filter(
    (q) =>
      q.question.toLowerCase().includes(k) ||
      q.answer.toLowerCase().includes(k) ||
      q.category.toLowerCase().includes(k),
  );
}

export function randomQuestion(slug?: string): Question {
  const pool = slug ? getByCategory(slug) : questions;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  入门: "text-[var(--ok)] border-[var(--ok)]/25 bg-[var(--ok)]/10",
  进阶: "text-[var(--warn)] border-[var(--warn)]/25 bg-[var(--warn)]/10",
  挑战: "text-[var(--hard)] border-[var(--hard)]/25 bg-[var(--hard)]/10",
};
