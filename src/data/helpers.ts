import type { Choice, ImageType, Level, Question, TopicId } from "./types";
import { TOPIC_BY_ID } from "./topics";

export const c = (zh: string, en: string, extra: Partial<Choice> = {}): Choice => ({ zh, en, ...extra });

export interface Spec {
  topic: TopicId;
  d?: 1 | 2 | 3;
  qz: string;
  qe: string;
  audio?: string;
  img?: ImageType;
  cfg?: Record<string, unknown>;
  right: Choice;
  wrong: Choice[]; // 必須 3 個
  ez: string;
  ee: string;
  tags: string[];
  style?: "text" | "icon" | "color" | "swatch";
}

const PREFIX: Record<TopicId, string> = {
  chars: "CH",
  radicals: "RA",
  words: "WD",
  measure: "ME",
  sentences: "SE",
  listening: "LI",
  story: "ST",
  life: "LF",
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** 由選項池揀出 n 個唔同嘅干擾項（固定種子，結果每次一樣） */
export function pick<T extends { zh: string }>(pool: T[], exclude: string[], n: number, seed: number): T[] {
  const uniq: T[] = [];
  for (const p of pool) if (!exclude.includes(p.zh) && !uniq.some((u) => u.zh === p.zh)) uniq.push(p);
  if (uniq.length <= n) return uniq;
  const L = uniq.length;
  let stride = [3, 5, 7, 2, 11][seed % 5];
  while (gcd(stride, L) !== 1) stride++;
  const start = (seed * 7 + 3) % L;
  return Array.from({ length: n }, (_, k) => uniq[(start + k * stride) % L]);
}

export class Bank {
  list: Question[] = [];
  private counters: Partial<Record<TopicId, number>> = {};
  constructor(public level: Level) {}

  get n() {
    return this.list.length;
  }

  add(s: Spec) {
    const topic = TOPIC_BY_ID[s.topic];
    const num = (this.counters[s.topic] ?? 0) + 1;
    this.counters[s.topic] = num;
    // 正確答案位置平均分佈
    const pos = (this.n * 3 + Math.floor(this.n / 4)) % 4;
    const choices = [...s.wrong];
    choices.splice(pos, 0, s.right);
    const q: Question = {
      id: `${this.level}-${PREFIX[s.topic]}-${String(num).padStart(3, "0")}`,
      level: this.level,
      topic: topic.zh,
      topicEn: topic.en,
      topicId: s.topic,
      difficulty: s.d ?? (this.level === "K2" ? 1 : 2),
      questionZh: s.qz,
      questionEn: s.qe,
      audioText: s.audio ?? s.qz.replace(/[「」]/g, "").replace(/[＿_]{2,}/g, "，"),
      imageType: s.img ?? "none",
      imageConfig: s.cfg ?? {},
      choices: choices as Question["choices"],
      correctIndex: pos,
      explanationZh: s.ez,
      explanationEn: s.ee,
      tags: s.tags,
      choiceStyle: s.style,
    };
    this.list.push(q);
  }
}
