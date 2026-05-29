import type { Metadata } from "next";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
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
        <header className="glass sticky top-0 z-20 border-b border-[var(--border-soft)]">
          <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-sm">
                🧠
              </span>
              <span>AI 八股 · 大白话</span>
            </Link>
            <div className="ml-2">
              <NavLinks />
            </div>
            <a
              href="https://github.com/huangguang1999/ai-bagu-web"
              target="_blank"
              rel="noreferrer"
              className="ml-auto rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--text)]"
            >
              GitHub ↗
            </a>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-[var(--faint)]">
          内容 AI 辅助生成,使用前请自行核对 · 题源见各题底部 ·
          <a
            href="https://github.com/huangguang1999/awesome-ai-knowledge"
            className="ml-1 underline decoration-dotted underline-offset-2 hover:text-[var(--muted)]"
          >
            开源于 GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
