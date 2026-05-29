"use client";
import { useEffect, useState } from "react";

// 显示当前站点的 origin(如 https://xxx.vercel.app),让文档里的示例 URL 是真实可用的。
export function useOrigin() {
  const [origin, setOrigin] = useState("https://你的域名");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);
  return origin;
}
