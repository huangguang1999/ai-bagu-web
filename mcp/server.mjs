#!/usr/bin/env node
// AI 八股大白话题库 · MCP server(stdio)。
// 通过 REST API 拉数据,接入任意支持 MCP 的 agent(Claude Code / Cursor / Claude Desktop)。
// 配置:环境变量 AI_BAGU_BASE 指向站点(默认 http://localhost:3000)。
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = (process.env.AI_BAGU_BASE || "http://localhost:3000").replace(/\/$/, "");

async function api(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return res.json();
}

function text(obj) {
  return { content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] };
}

function fmtQuestion(q) {
  return [
    `【${q.category} · ${q.difficulty}】`,
    `题目:${q.question}`,
    "",
    q.answer,
    q.source ? `\n题源:${q.source.name}(AI 辅助生成的大白话版,使用前请自行核对)` : "",
  ].join("\n");
}

const server = new McpServer({ name: "ai-bagu", version: "0.1.0" });

server.registerTool(
  "list_categories",
  {
    title: "列出题库分类",
    description: "返回 AI 八股题库的全部分类(含题量与难度)。",
    inputSchema: {},
  },
  async () => {
    const r = await api("/api/categories");
    return text(r.data.map((c) => `${c.title}(${c.slug})· ${c.count} 题 · ${c.difficulty}`).join("\n"));
  },
);

server.registerTool(
  "random_question",
  {
    title: "随机出一道题",
    description: "随机抽一道 AI 面试八股题(可按分类 slug 限定,如 rag / agent / prompt / llm-basics)。用于考考用户。",
    inputSchema: { category: z.string().optional().describe("分类 slug,可选;不传则全库随机") },
  },
  async ({ category }) => {
    const q = await api(`/api/random${category ? `?category=${encodeURIComponent(category)}` : ""}`);
    return text(fmtQuestion(q));
  },
);

server.registerTool(
  "search_questions",
  {
    title: "搜索题目",
    description: "按关键词搜索题目与答案,返回匹配的题目列表(题目 + id)。",
    inputSchema: { q: z.string().describe("搜索关键词,如「注意力」「向量数据库」") },
  },
  async ({ q }) => {
    const r = await api(`/api/search?q=${encodeURIComponent(q)}`);
    if (!r.count) return text(`没有匹配「${q}」的题目。`);
    return text(r.data.map((x) => `[${x.id}] (${x.category}) ${x.question}`).join("\n"));
  },
);

server.registerTool(
  "get_question",
  {
    title: "查看某题完整讲解",
    description: "根据题目 id 返回完整的大白话讲解。id 可从 search_questions 获取。",
    inputSchema: { id: z.string().describe("题目 id,如 rag-1") },
  },
  async ({ id }) => {
    const res = await fetch(`${BASE}/api/questions/${encodeURIComponent(id)}`);
    if (res.status === 404) return text(`找不到 id 为 ${id} 的题目。`);
    if (!res.ok) throw new Error(`API -> ${res.status}`);
    return text(fmtQuestion(await res.json()));
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`ai-bagu MCP server 已启动,数据源:${BASE}`);
