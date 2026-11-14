// 安全嘅 localStorage 包裝：被禁用時自動改用記憶體，不會報錯
// Safe localStorage wrapper: falls back to memory when storage is unavailable.

export const STORAGE_KEYS = {
  progress: "happyChinese.progress",
  badges: "happyChinese.badges",
  recentResults: "happyChinese.recentResults",
  wrongQuestions: "happyChinese.wrongQuestions",
  settings: "happyChinese.settings",
} as const;

export const DATA_VERSION = 1;

const memory = new Map<string, string>();
let persistent: boolean | null = null;

export function isStorageAvailable(): boolean {
  if (persistent !== null) return persistent;
  try {
    const k = "__happyChinese_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    persistent = true;
  } catch {
    persistent = false;
  }
  return persistent;
}

export function readJSON<T>(key: string): T | null {
  try {
    const raw = isStorageAvailable() ? window.localStorage.getItem(key) : memory.get(key) ?? null;
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  try {
    if (isStorageAvailable()) window.localStorage.setItem(key, raw);
    else memory.set(key, raw);
  } catch {
    memory.set(key, raw);
  }
}

export function removeKey(key: string): void {
  memory.delete(key);
  try {
    if (isStorageAvailable()) window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
