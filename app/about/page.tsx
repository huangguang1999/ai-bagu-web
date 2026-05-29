import Link from "next/link";

export const metadata = { title: "关于 · AI 八股" };

export default function AboutPage() {
  return (
    <div className="space-y-5 leading-relaxed">
      <h1 className="text-2xl font-bold">关于</h1>
      <p className="text-[var(--muted)]">
        满地都是给「标准答案」的 AI 面试题库,可对一个刚入门的人,那些答案本身就是另一道题:
        满屏术语、堆公式、默认你已经懂。这个站只做一件事——
        <b className="text-[var(--text)]">把真实的 AI 面试题,讲到没有任何基础的人也能听懂</b>。
      </p>
      <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
        <li>每题四段:💡 一句话先懂 · 🌰 打个比方 · 🔑 答题要点 · 🚀 再进一步</li>
        <li>题目整理自开源面试题库(每题底部标注来源),答案为 AI 辅助生成的大白话版</li>
        <li>做题进度(已掌握 / 收藏)存在你本地浏览器,不上传任何服务器</li>
        <li>题库同时以 <Link href="/agent" className="text-[var(--accent)] underline">MCP / REST API</Link> 开放,可接入任意 AI agent</li>
      </ul>
      <p className="text-sm text-[var(--muted)]">
        ⚠️ 内容可能有误,尤其是非常具体的工具/版本细节,请把它当作快速建立理解的入门读物,
        关键内容建议再对照官方文档核实。发现错误欢迎到{" "}
        <a href="https://github.com/huangguang1999/awesome-ai-knowledge" className="text-[var(--accent)] underline">
          GitHub 仓库
        </a>{" "}
        提 Issue / PR。
      </p>
    </div>
  );
}
