#!/usr/bin/env node
// 把 awesome-ai-knowledge/docs/*.md 解析成结构化题库 data/questions.json。
// 内容改了就重跑:node scripts/sync-questions.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
// 题库源:同级的 awesome-ai-knowledge 仓库(可用环境变量覆盖)
const DOCS = process.env.DOCS_DIR ||
  path.resolve(ROOT, "..", "awesome-ai-knowledge", "docs");
const OUT = path.join(ROOT, "data");

// 各分类的英文 slug + LeetCode 式难度(按入门友好程度划)
const META = {
  "大模型基础":      { slug: "llm-basics",  difficulty: "入门" },
  "AI Agent(智能体)": { slug: "agent",      difficulty: "进阶" },
  "RAG(检索增强)":   { slug: "rag",         difficulty: "进阶" },
  "模型与 Agent 评估": { slug: "eval",        difficulty: "进阶" },
  "Prompt 工程":     { slug: "prompt",      difficulty: "入门" },
  "微调与对齐":      { slug: "finetune",    difficulty: "进阶" },
  "工具调用 & MCP":  { slug: "tools-mcp",   difficulty: "进阶" },
  "部署与推理优化":  { slug: "serving",     difficulty: "挑战" },
  "向量与 Embedding": { slug: "embedding",   difficulty: "入门" },
  "多模态":          { slug: "multimodal",  difficulty: "进阶" },
  "AI 应用实战 & 安全": { slug: "app-safety", difficulty: "挑战" },
};

function slugify(title) {
  return META[title]?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function parseFile(file) {
  const text = fs.readFileSync(file, "utf-8");
  const orderMatch = path.basename(file).match(/^(\d+)/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : 99;

  const title = (text.match(/^#\s+(.+)$/m) || [])[1]?.trim() || "未命名";
  // 第一个 > 是简介,含"题目出自"的 > 是题源
  const quotes = [...text.matchAll(/^>\s+(.+)$/gm)].map((m) => m[1].trim());
  const intro = quotes.find((q) => !q.includes("题目出自")) || "";
  const srcLine = quotes.find((q) => q.includes("题目出自")) || "";
  const srcLink = srcLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const source = srcLink ? { name: srcLink[1], url: srcLink[2] } : null;

  const slug = slugify(title);
  const difficulty = META[title]?.difficulty || "进阶";

  // 每题:## N. 题目  ...正文...  ---
  const questions = [];
  const re = /^##\s+(\d+)\.\s+(.+?)\s*$([\s\S]*?)(?=^---\s*$)/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    const idx = parseInt(m[1], 10);
    const question = m[2].trim();
    const answer = m[3].trim();
    if (!question || !answer) continue;
    questions.push({
      id: `${slug}-${idx}`,
      category: title,
      categorySlug: slug,
      categoryOrder: order,
      index: idx,
      difficulty,
      question,
      answer,
      source,
    });
  }
  return { title, slug, order, intro, source, count: questions.length, questions };
}

function main() {
  if (!fs.existsSync(DOCS)) {
    console.error(`找不到题库目录: ${DOCS}\n用 DOCS_DIR=... 指定`);
    process.exit(1);
  }
  const files = fs.readdirSync(DOCS)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const cats = [];
  const allQ = [];
  for (const f of files) {
    const r = parseFile(path.join(DOCS, f));
    cats.push({
      title: r.title, slug: r.slug, order: r.order,
      intro: r.intro, source: r.source, count: r.count,
      difficulty: META[r.title]?.difficulty || "进阶",
    });
    allQ.push(...r.questions);
  }
  cats.sort((a, b) => a.order - b.order);
  allQ.sort((a, b) =>
    a.categoryOrder - b.categoryOrder || a.index - b.index);

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "questions.json"),
    JSON.stringify(allQ, null, 2));
  fs.writeFileSync(path.join(OUT, "categories.json"),
    JSON.stringify(cats, null, 2));

  console.log(`✓ ${allQ.length} 题 / ${cats.length} 分类 → data/`);
  for (const c of cats) console.log(`  ${c.order}. ${c.title} (${c.count}) [${c.difficulty}]`);
}

main();
