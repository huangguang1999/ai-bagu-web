"use client";

import { useOrigin } from "@/components/Origin";

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-3 border-b border-[var(--border)] py-2.5 last:border-0">
      <span className="rounded bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
        {method}
      </span>
      <code className="text-sm text-[var(--accent)]">{path}</code>
      <span className="text-sm text-[var(--muted)]">{desc}</span>
    </div>
  );
}

export default function AgentPage() {
  const origin = useOrigin();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Agent 接入 🤖</h1>
        <p className="mt-2 text-[var(--muted)]">
          把这个题库接进任意 AI agent —— 支持标准 <b>MCP</b>(给 Claude Code / Cursor 等)和开放
          <b> REST API</b>(给任何程序 / 别人的 bot)。无需鉴权,开箱即用。
        </p>
      </section>

      {/* REST API */}
      <section>
        <h2 className="text-lg font-semibold">① REST API</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          公开只读接口,已开 CORS,直接 <code>curl</code> 或 fetch 即可。Base URL:
          <code className="ml-1 text-[var(--accent)]">{origin}</code>
        </p>
        <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4">
          <Endpoint method="GET" path="/api/categories" desc="全部分类(题量、难度)" />
          <Endpoint method="GET" path="/api/questions" desc="题目列表,支持 category / difficulty / q / limit / offset / fields=meta" />
          <Endpoint method="GET" path="/api/questions/:id" desc="单题详情(含大白话答案)" />
          <Endpoint method="GET" path="/api/random?category=rag" desc="随机出一题(可按分类)" />
          <Endpoint method="GET" path="/api/search?q=向量" desc="按关键词搜索题目/答案" />
        </div>
        <p className="mt-4 mb-1 text-sm font-medium">示例</p>
        <Code>{`# 随机来一道 RAG 八股
curl "${origin}/api/random?category=rag"

# 按关键词搜
curl "${origin}/api/search?q=注意力"

# 只取题目元信息(不含答案),适合做列表
curl "${origin}/api/questions?difficulty=入门&fields=meta&limit=5"`}</Code>
      </section>

      {/* MCP */}
      <section>
        <h2 className="text-lg font-semibold">② MCP 接入(Claude Code / Cursor 等)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          MCP(Model Context Protocol)是 agent 调用外部工具的开放标准。接入后,你的 AI 助手就能直接
          「随机出题考我」「搜一道关于 MoE 的题」。
        </p>

        <p className="mt-4 mb-1 text-sm font-medium">Claude Code:一条命令接入</p>
        <Code>{`claude mcp add ai-bagu \\
  -e AI_BAGU_BASE=${origin} \\
  -- npx -y ai-bagu-mcp`}</Code>

        <p className="mt-4 mb-1 text-sm font-medium">或手动写进 MCP 配置(Cursor / Claude Desktop)</p>
        <Code>{`{
  "mcpServers": {
    "ai-bagu": {
      "command": "npx",
      "args": ["-y", "ai-bagu-mcp"],
      "env": { "AI_BAGU_BASE": "${origin}" }
    }
  }
}`}</Code>

        <p className="mt-4 text-sm text-[var(--muted)]">
          接入后可用工具:<code>list_categories</code>、<code>random_question</code>、
          <code>search_questions</code>、<code>get_question</code>。
          源码见 GitHub 仓库 <code>mcp/</code> 目录,也可本地
          <code> node mcp/server.mjs</code> 直接跑。
        </p>
      </section>
    </div>
  );
}
