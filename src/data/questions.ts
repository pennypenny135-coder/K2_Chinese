// 開心中文樂園 — 完整題庫（K2 + K3）
// 題目按主題拆開寫喺 k2Core / k2More / k3Core / k3More，呢度負責合併、統計同抽題。
// 如何新增題目：見 README.md「如何新增題目」。
import { Bank } from "./helpers";
import { addK2Core } from "./k2Core";
import { addK2More } from "./k2More";
import { addK3Core } from "./k3Core";
import { addK3More } from "./k3More";
import { TOPICS } from "./topics";
import type { Level, Question, TopicId } from "./types";

export type { Question, Level, TopicId, Choice } from "./types";

function build(level: Level, fns: ((b: Bank) => void)[]): Question[] {
  const b = new Bank(level);
  fns.forEach((f) => f(b));
  return b.list;
}

export const K2_QUESTIONS: Question[] = build("K2", [addK2Core, addK2More]);
export const K3_QUESTIONS: Question[] = build("K3", [addK3Core, addK3More]);
export const ALL_QUESTIONS: Question[] = [...K2_QUESTIONS, ...K3_QUESTIONS];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));

export interface BankStats {
  total: number;
  byLevel: Record<Level, number>;
  byTopic: Record<Level, Record<TopicId, number>>;
}

/** 題庫分類統計 */
export function getBankStats(): BankStats {
  const empty = () => Object.fromEntries(TOPICS.map((t) => [t.id, 0])) as Record<TopicId, number>;
  const stats: BankStats = { total: ALL_QUESTIONS.length, byLevel: { K2: 0, K3: 0 }, byTopic: { K2: empty(), K3: empty() } };
  for (const q of ALL_QUESTIONS) {
    stats.byLevel[q.level]++;
    stats.byTopic[q.level][q.topicId]++;
  }
  return stats;
}

export type QuizKind = TopicId | "mixed" | "wrong";

export function questionsFor(level: Level, kind: TopicId | "mixed"): Question[] {
  const list = level === "K2" ? K2_QUESTIONS : K3_QUESTIONS;
  return kind === "mixed" ? list : list.filter((q) => q.topicId === kind);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 每次隨機抽 10 題；綜合挑戰會盡量平均涵蓋各主題；錯題練習會優先抽答錯過嘅題 */
export function pickQuiz(level: Level, kind: QuizKind, wrongIds: string[] = [], count = 10): Question[] {
  if (kind === "wrong") {
    const wrongQs = shuffle(wrongIds.map((id) => QUESTION_BY_ID[id]).filter((q): q is Question => !!q && q.level === level));
    const rest = shuffle(questionsFor(level, "mixed").filter((q) => !wrongQs.includes(q)));
    return [...wrongQs, ...rest].slice(0, count);
  }
  if (kind === "mixed") {
    // 每個主題輪流抽一題，確保多元
    const buckets = TOPICS.map((t) => shuffle(questionsFor(level, t.id)));
    const picked: Question[] = [];
    let i = 0;
    while (picked.length < count) {
      const bucket = buckets[i % buckets.length];
      const q = bucket.shift();
      if (q) picked.push(q);
      i++;
      if (i > 500) break;
    }
    return shuffle(picked);
  }
  return shuffle(questionsFor(level, kind)).slice(0, count);
}
