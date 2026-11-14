import type { Bi } from "./i18n";
import type { GameResult, ProgressData } from "./store";

export interface BadgeDef {
  id: string;
  name: Bi;
  desc: Bi;
  icon: string; // Illustration 名稱
  check: (ctx: { progress: ProgressData; result: GameResult }) => boolean;
}

const b = (zh: string, en: string): Bi => ({ zh, en });

const topicsPlayed = (p: ProgressData, level: string) =>
  Object.keys(p.topicStats).filter((k) => k.startsWith(level + ":")).length;

export const BADGES: BadgeDef[] = [
  { id: "first", name: b("初試牛刀", "First Try"), desc: b("完成第一組 10 題", "Finish your first 10 questions"), icon: "flower", check: ({ progress }) => progress.gamesPlayed >= 1 },
  { id: "perfect", name: b("滿分小達人", "Perfect Score"), desc: b("一組 10 題全部一次答對", "Get all 10 right on the first try"), icon: "star", check: ({ result }) => result.total >= 10 && result.correct === result.total },
  { id: "combo5", name: b("連勝高手", "Combo Star"), desc: b("連續 5 題一次答對", "5 first-try answers in a row"), icon: "fire", check: ({ progress }) => progress.bestCombo >= 5 },
  { id: "combo10", name: b("連勝大師", "Combo Master"), desc: b("連續 10 題一次答對", "10 first-try answers in a row"), icon: "sun", check: ({ progress }) => progress.bestCombo >= 10 },
  { id: "stars30", name: b("星星收集者", "Star Collector"), desc: b("收集 30 粒星星", "Collect 30 stars"), icon: "star", check: ({ progress }) => progress.stars >= 30 },
  { id: "stars100", name: b("星星達人", "Star Expert"), desc: b("收集 100 粒星星", "Collect 100 stars"), icon: "moon", check: ({ progress }) => progress.stars >= 100 },
  { id: "stars300", name: b("星星大王", "Star King"), desc: b("收集 300 粒星星", "Collect 300 stars"), icon: "cake", check: ({ progress }) => progress.stars >= 300 },
  { id: "games5", name: b("勤力小朋友", "Hard Worker"), desc: b("完成 5 組練習", "Complete 5 practices"), icon: "bag", check: ({ progress }) => progress.gamesPlayed >= 5 },
  { id: "games20", name: b("學習之星", "Learning Star"), desc: b("完成 20 組練習", "Complete 20 practices"), icon: "book", check: ({ progress }) => progress.gamesPlayed >= 20 },
  { id: "k2explorer", name: b("K2 小探險家", "K2 Explorer"), desc: b("玩過 K2 全部 8 個主題", "Try all 8 K2 topics"), icon: "balloon", check: ({ progress }) => topicsPlayed(progress, "K2") >= 8 },
  { id: "k3explorer", name: b("K3 小探險家", "K3 Explorer"), desc: b("玩過 K3 全部 8 個主題", "Try all 8 K3 topics"), icon: "plane", check: ({ progress }) => topicsPlayed(progress, "K3") >= 8 },
  { id: "speedy", name: b("快手熊貓", "Speedy Panda"), desc: b("90 秒內完成，並答啱 8 題或以上", "Finish within 90 seconds with 8+ correct"), icon: "rabbit", check: ({ result }) => result.seconds <= 90 && result.correct >= 8 },
];

export const BADGE_BY_ID: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((x) => [x.id, x]));

// 貼紙（每完成 10 題送一張）
export const STICKERS = [
  "star", "balloon", "apple", "cat", "fish", "flower", "sun", "rabbit", "cake", "car",
  "bird", "banana", "dog", "moon", "plane", "elephant", "heart", "monkey", "lion", "butterfly",
  "watermelon", "boat", "pig", "cow", "train",
];
