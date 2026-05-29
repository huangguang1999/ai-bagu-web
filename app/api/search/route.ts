// GET /api/search?q=keyword  → 搜索题目/答案
import { json, options } from "@/lib/api";
import { searchQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic"; // 读 searchParams,必须动态

export function OPTIONS() {
  return options();
}

export function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "";
  const data = searchQuestions(q);
  return json({ query: q, count: data.length, data });
}
