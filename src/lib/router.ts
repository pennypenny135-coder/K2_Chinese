import { useSyncExternalStore } from "react";

// 簡單 hash 路由（#/k2、#/quiz?level=K2&topic=chars）— 純靜態部署，無需伺服器設定
function getHash(): string {
  return typeof window === "undefined" ? "/" : window.location.hash.replace(/^#/, "") || "/";
}
function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export interface Route {
  path: string;
  params: URLSearchParams;
  key: string;
}

export function useRoute(): Route {
  const raw = useSyncExternalStore(subscribe, getHash, () => "/");
  const [path, query = ""] = raw.split("?");
  return { path: path || "/", params: new URLSearchParams(query), key: raw };
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function quizUrl(level: string, kind: string) {
  return `/quiz?level=${level}&topic=${kind}`;
}
