import type { TopicId } from "./types";

export interface TopicInfo {
  id: TopicId;
  zh: string;
  en: string;
  icon: string; // Illustration 圖形名稱
  bg: string; // tailwind 背景
}

export const TOPICS: TopicInfo[] = [
  { id: "chars", zh: "認字", en: "Characters", icon: "charcard", bg: "bg-sky-300" },
  { id: "radicals", zh: "部首筆順", en: "Radicals & Stroke Order", icon: "pencil", bg: "bg-orange-300" },
  { id: "words", zh: "詞語", en: "Words", icon: "apple", bg: "bg-rose-300" },
  { id: "measure", zh: "量詞", en: "Measure Words", icon: "blocks", bg: "bg-violet-300" },
  { id: "sentences", zh: "句子", en: "Sentences", icon: "book", bg: "bg-emerald-300" },
  { id: "listening", zh: "聆聽", en: "Listening", icon: "ear", bg: "bg-yellow-300" },
  { id: "story", zh: "故事", en: "Stories", icon: "house", bg: "bg-pink-300" },
  { id: "life", zh: "生活常識", en: "Daily Life", icon: "sun", bg: "bg-teal-300" },
];

export const TOPIC_BY_ID: Record<TopicId, TopicInfo> = TOPICS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TopicId, TopicInfo>,
);
