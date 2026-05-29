import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 八股 · 大白话刷题",
  description:
    "LeetCode 式 AI 面试八股刷题站:100+ 真实面试题 + 零基础也能看懂的大白话讲解。支持 MCP / REST API 接入任意 AI agent。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="text-lg">🧠</span>
              <span>AI 八股 · 大白话</span>
            </Link>
            <div className="flex items-center gap-5 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--text)]">
                题库
              </Link>
              <Link href="/agent" className="hover:text-[var(--text)]">
                Agent 接入
              </Link>
              <Link href="/about" className="hover:text-[var(--text)]">
                关于
              </Link>
            </div>
            <a
              href="https://github.com/huangguang1999/awesome-ai-knowledge"
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-sm text-[var(--muted)] hover:text-[var(--text)]"
            >
              GitHub ↗
            </a>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-[var(--muted)]">
          内容 AI 辅助生成,使用前请自行核对 · 题源见各题底部 ·
          <a
            href="https://github.com/huangguang1999/awesome-ai-knowledge"
            className="ml-1 underline hover:text-[var(--text)]"
          >
            开源于 GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
