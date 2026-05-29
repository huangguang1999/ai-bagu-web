"use client";
// 纯前端做题进度:已掌握 / 收藏,存在 localStorage,无需后端。
import { useCallback, useEffect, useState } from "react";

const KEY_MASTERED = "aibg:mastered";
const KEY_FAV = "aibg:fav";

function load(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set();
  }
}

function save(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
  // 通知同页其它组件刷新
  window.dispatchEvent(new Event("aibg:progress"));
}

export function useProgress() {
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [fav, setFav] = useState<Set<string>>(new Set());

  const refresh = useCallback(() => {
    setMastered(load(KEY_MASTERED));
    setFav(load(KEY_FAV));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("aibg:progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("aibg:progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const toggle = useCallback((key: string, id: string) => {
    const set = load(key);
    set.has(id) ? set.delete(id) : set.add(id);
    save(key, set);
  }, []);

  return {
    mastered,
    fav,
    toggleMastered: (id: string) => toggle(KEY_MASTERED, id),
    toggleFav: (id: string) => toggle(KEY_FAV, id),
  };
}
