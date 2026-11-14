import { DATA_VERSION, STORAGE_KEYS, readJSON, removeKey, writeJSON } from "./storage";
import type { Level, TopicId } from "@/data/types";
import { BADGES, STICKERS } from "./badges";

export type QuizKind = TopicId | "mixed" | "wrong";

export interface TopicStat {
  answered: number;
  correct: number;
}
export interface ProgressData {
  version: number;
  stars: number;
  gamesPlayed: number;
  bestCombo: number;
  stickers: string[];
  topicStats: Record<string, TopicStat>; // key: `${level}:${topicId}`
}
export interface BadgesData {
  version: number;
  earned: Record<string, string>; // badgeId -> ISO date
}
export interface GameResult {
  date: string;
  level: Level;
  kind: QuizKind;
  total: number;
  correct: number; // 一次答對
  stars: number;
  seconds: number;
  bestCombo: number;
}
export interface RecentData {
  version: number;
  items: GameResult[];
}
export interface WrongData {
  version: number;
  items: Record<string, number>;
}
export interface SettingsData {
  version: number;
  sound: boolean;
  music: boolean;
  speech: boolean;
}
export interface AppState {
  progress: ProgressData;
  badges: BadgesData;
  recent: RecentData;
  wrong: WrongData;
  settings: SettingsData;
}

const defaults = (): AppState => ({
  progress: { version: DATA_VERSION, stars: 0, gamesPlayed: 0, bestCombo: 0, stickers: [], topicStats: {} },
  badges: { version: DATA_VERSION, earned: {} },
  recent: { version: DATA_VERSION, items: [] },
  wrong: { version: DATA_VERSION, items: {} },
  settings: { version: DATA_VERSION, sound: true, music: true, speech: true },
});

// 讀取並按版本升級 / load + migrate by version
function load<T extends { version: number }>(key: string, fallback: T): T {
  const data = readJSON<T>(key);
  if (!data || typeof data !== "object") return fallback;
  // 日後如 version 改變，喺度加入升級邏輯 / add migrations here when version changes
  return { ...fallback, ...data, version: DATA_VERSION };
}

function init(): AppState {
  const d = defaults();
  return {
    progress: load(STORAGE_KEYS.progress, d.progress),
    badges: load(STORAGE_KEYS.badges, d.badges),
    recent: load(STORAGE_KEYS.recentResults, d.recent),
    wrong: load(STORAGE_KEYS.wrongQuestions, d.wrong),
    settings: load(STORAGE_KEYS.settings, d.settings),
  };
}

let state: AppState = init();
const listeners = new Set<() => void>();

function persist() {
  writeJSON(STORAGE_KEYS.progress, state.progress);
  writeJSON(STORAGE_KEYS.badges, state.badges);
  writeJSON(STORAGE_KEYS.recentResults, state.recent);
  writeJSON(STORAGE_KEYS.wrongQuestions, state.wrong);
  writeJSON(STORAGE_KEYS.settings, state.settings);
}
function emit() {
  listeners.forEach((l) => l());
}

export function getState(): AppState {
  return state;
}
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSettings(patch: Partial<Omit<SettingsData, "version">>) {
  state = { ...state, settings: { ...state.settings, ...patch } };
  writeJSON(STORAGE_KEYS.settings, state.settings);
  emit();
}

export interface QuestionOutcome {
  id: string;
  topicId: TopicId;
  firstTryCorrect: boolean;
}
export interface RecordOutcome {
  newBadges: string[];
  newSticker: string | null;
}

export function recordGame(
  level: Level,
  kind: QuizKind,
  outcomes: QuestionOutcome[],
  seconds: number,
  bestCombo: number,
): RecordOutcome {
  const correct = outcomes.filter((o) => o.firstTryCorrect).length;
  const stars = correct;

  const topicStats = { ...state.progress.topicStats };
  const wrongItems = { ...state.wrong.items };
  for (const o of outcomes) {
    const key = `${level}:${o.topicId}`;
    const cur = topicStats[key] ?? { answered: 0, correct: 0 };
    topicStats[key] = { answered: cur.answered + 1, correct: cur.correct + (o.firstTryCorrect ? 1 : 0) };
    if (!o.firstTryCorrect) wrongItems[o.id] = (wrongItems[o.id] ?? 0) + 1;
    else if (wrongItems[o.id]) {
      wrongItems[o.id] -= 1;
      if (wrongItems[o.id] <= 0) delete wrongItems[o.id];
    }
  }

  // 貼紙：每完成一組 10 題，送一張未有嘅貼紙
  const owned = new Set(state.progress.stickers);
  const nextSticker = STICKERS.find((s) => !owned.has(s)) ?? null;
  const stickers = nextSticker ? [...state.progress.stickers, nextSticker] : state.progress.stickers;

  const progress: ProgressData = {
    ...state.progress,
    stars: state.progress.stars + stars,
    gamesPlayed: state.progress.gamesPlayed + 1,
    bestCombo: Math.max(state.progress.bestCombo, bestCombo),
    stickers,
    topicStats,
  };

  const result: GameResult = {
    date: new Date().toISOString(),
    level,
    kind,
    total: outcomes.length,
    correct,
    stars,
    seconds,
    bestCombo,
  };
  const recent: RecentData = { version: DATA_VERSION, items: [result, ...state.recent.items].slice(0, 30) };

  // 獎章
  const earned = { ...state.badges.earned };
  const newBadges: string[] = [];
  for (const badge of BADGES) {
    if (!earned[badge.id] && badge.check({ progress, result })) {
      earned[badge.id] = result.date;
      newBadges.push(badge.id);
    }
  }

  state = {
    ...state,
    progress,
    recent,
    wrong: { version: DATA_VERSION, items: wrongItems },
    badges: { version: DATA_VERSION, earned },
  };
  persist();
  emit();
  return { newBadges, newSticker: nextSticker };
}

export function clearAllRecords() {
  const settings = state.settings;
  const d = defaults();
  state = { ...d, settings };
  removeKey(STORAGE_KEYS.progress);
  removeKey(STORAGE_KEYS.badges);
  removeKey(STORAGE_KEYS.recentResults);
  removeKey(STORAGE_KEYS.wrongQuestions);
  persist();
  emit();
}
