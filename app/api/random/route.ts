// GET /api/random?category=  → 随机返回一题(每次调用都不同,故不缓存)
import { json, options } from "@/lib/api";
import { randomQuestion } from "@/lib/questions";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return options();
}

export function GET(req: Request) {
  const category = new URL(req.url).searchParams.get("category") || undefined;
  return json(randomQuestion(category));
}
