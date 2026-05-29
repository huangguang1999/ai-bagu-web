// GET /api/categories  → 全部分类(含题量、难度)
import { json, options } from "@/lib/api";
import { categories } from "@/lib/questions";

export const dynamic = "force-static";

export function OPTIONS() {
  return options();
}

export function GET() {
  return json({ count: categories.length, data: categories });
}
