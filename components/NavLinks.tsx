"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "题库" },
  { href: "/agent", label: "Agent 接入" },
  { href: "/about", label: "关于" },
];

export default function NavLinks() {
  const path = usePathname();
  return (
    <div className="flex items-center gap-1 text-sm">
      {LINKS.map((l) => {
        const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg px-3 py-1.5 transition ${
              active
                ? "bg-white/8 text-[var(--text)]"
                : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
