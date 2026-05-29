# ai-bagu-mcp

[AI 八股 · 大白话刷题站](https://ai-bagu-web.vercel.app) 的 MCP server —— 把 100+ 道真实 AI 面试题(含零基础大白话讲解)封装成工具,接入任意支持 [MCP](https://modelcontextprotocol.io) 的 AI agent(Claude Code / Cursor / Claude Desktop 等)。

接入后你就能让 AI:「**随机出一道 RAG 八股考我**」「**搜一道关于注意力机制的题**」。

## 一键接入(Claude Code)

```bash
claude mcp add ai-bagu -e AI_BAGU_BASE=https://ai-bagu-web.vercel.app -- npx -y ai-bagu-mcp
```

## 手动配置(Cursor / Claude Desktop)

```json
{
  "mcpServers": {
    "ai-bagu": {
      "command": "npx",
      "args": ["-y", "ai-bagu-mcp"],
      "env": { "AI_BAGU_BASE": "https://ai-bagu-web.vercel.app" }
    }
  }
}
```

## 工具

| 工具 | 作用 |
|---|---|
| `list_categories` | 列出题库分类(题量、难度) |
| `random_question` | 随机出一题(可按分类 slug,如 `rag` / `agent` / `prompt`) |
| `search_questions` | 按关键词搜索题目 |
| `get_question` | 按 id 查看某题完整大白话讲解 |

## 配置

- `AI_BAGU_BASE`:题库站点地址,默认 `http://localhost:3000`。线上用 `https://ai-bagu-web.vercel.app`。

数据来自开源题库 [awesome-ai-knowledge](https://github.com/huangguang1999/awesome-ai-knowledge),答案为 AI 辅助生成的大白话版,使用前请自行核对。MIT License。
