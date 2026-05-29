# AI 八股 · 大白话刷题站

> 像刷 LeetCode 一样刷 AI 面试八股 —— 100+ 真实面试题 + 零基础也能看懂的大白话讲解,
> 并以 **MCP / REST API** 开放题库,可接入任意 AI agent。

🌐 **线上地址:[ai-bagu-web.vercel.app](https://ai-bagu-web.vercel.app)**

参考 [aihot](https://aihot.virxact.com/) 的「列表 + 分类 + Agent 接入」形态,题库来自开源仓库
[awesome-ai-knowledge](https://github.com/huangguang1999/awesome-ai-knowledge)。

## 功能

- **刷题列表**:11 个分类筛选、难度标(入门/进阶/挑战)、关键词搜索、随机一题
- **题目详情**:先自测、点击展开大白话讲解(💡 一句话 / 🌰 比方 / 🔑 要点 / 🚀 延伸)
- **做题进度**:已掌握 / 收藏,存浏览器 localStorage,无需登录、不上传
- **Agent 接入**:开放 REST API + MCP server,任意 AI 都能拉题/出题/搜索

## 技术栈

Next.js 16(App Router)· React 19 · Tailwind v4 · TypeScript · 部署 Vercel。
题库是纯静态 JSON,题目页全部 SSG 预渲染。

## 本地开发

```bash
npm install
npm run dev          # http://localhost:3000
```

## 题库数据

题目源是同级目录的 `awesome-ai-knowledge/docs/*.md`。内容更新后重新生成:

```bash
npm run sync         # 解析 markdown → data/questions.json + categories.json
```

`data/*.json` 已提交进仓库,是部署时的数据源(Vercel 上不依赖源 md)。

## REST API

无鉴权、已开 CORS,直接调用:

| 接口 | 说明 |
|---|---|
| `GET /api/categories` | 全部分类 |
| `GET /api/questions?category=&difficulty=&q=&limit=&offset=&fields=meta` | 题目列表 |
| `GET /api/questions/:id` | 单题详情 |
| `GET /api/random?category=` | 随机一题 |
| `GET /api/search?q=` | 搜索 |

```bash
curl "http://localhost:3000/api/random?category=rag"
```

## MCP 接入

`mcp/` 是独立的 MCP server(`ai-bagu-mcp`),把题库封装成 4 个工具:
`list_categories`、`random_question`、`search_questions`、`get_question`。

```bash
# Claude Code 一键接入(AI_BAGU_BASE 指向你部署的站点)
claude mcp add ai-bagu -e AI_BAGU_BASE=https://ai-bagu-web.vercel.app -- npx -y ai-bagu-mcp

# 或本地直接跑(先 cd mcp && npm install)
AI_BAGU_BASE=http://localhost:3000 node mcp/server.mjs
```

## 部署到 Vercel

把本仓库导入 Vercel(或 `vercel` CLI),框架自动识别为 Next.js,零配置部署。

## 免责声明

答案为 AI 辅助生成的大白话版,可能有误(尤其具体工具/版本细节),请把它当入门读物,
关键内容对照官方文档核实。题目出处见各题底部。
