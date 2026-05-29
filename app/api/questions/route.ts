// GET /api/questions?category=&difficulty=&q=&limit=&offset=&fields=meta
import { json, options, stripAnswer } from "@/lib/api";
import { questions } from "@/lib/questions";

export const dynamic = "force-dynamic"; // 读 searchParams,必须动态

export function OPTIONS() {
  return options();
}

export function GET(req: Request) {
  const u = new URL(req.url);
  const category = u.searchParams.get("category");
  const difficulty = u.searchParams.get("difficulty");
  const q = u.searchParams.get("q")?.trim().toLowerCase();
  const fields = u.searchParams.get("fields");
  const limit = Math.min(Number(u.searchParams.get("limit")) || 100, 100);
  const offset = Number(u.searchParams.get("offset")) || 0;

  let list = questions;
  if (category) list = list.filter((x) => x.categorySlug === category);
  if (difficulty) list = list.filter((x) => x.difficulty === difficulty);
  if (q)
    list = list.filter(
      (x) =>
        x.question.toLowerCase().includes(q) ||
        x.answer.toLowerCase().includes(q),
    );

  const total = list.length;
  const page = list.slice(offset, offset + limit);
  const data = fields === "meta" ? page.map(stripAnswer) : page;

  return json({ total, limit, offset, count: data.length, data });
}
