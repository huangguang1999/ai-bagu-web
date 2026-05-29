// GET /api/questions/:id
import { json, options } from "@/lib/api";
import { getQuestion, questions } from "@/lib/questions";

export const dynamic = "force-static";

export function generateStaticParams() {
  return questions.map((q) => ({ id: q.id }));
}

export function OPTIONS() {
  return options();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const q = getQuestion(id);
  if (!q) return json({ error: "not found", id }, 404);
  return json(q);
}
