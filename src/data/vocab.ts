import { c } from "./helpers";
import type { Choice } from "./types";

export interface Word {
  zh: string;
  en: string;
  icon?: string;
  color?: string;
}

/** Word → 選項（帶圖形） */
export const ch = (w: Word, withIcon = true): Choice =>
  c(w.zh, w.en, withIcon && w.icon ? { icon: w.icon, iconColor: w.color } : {});

export const ANIMALS: Word[] = [
  { zh: "貓", en: "cat", icon: "cat" },
  { zh: "狗", en: "dog", icon: "dog" },
  { zh: "鳥", en: "bird", icon: "bird" },
  { zh: "魚", en: "fish", icon: "fish" },
  { zh: "兔", en: "rabbit", icon: "rabbit" },
  { zh: "象", en: "elephant", icon: "elephant" },
  { zh: "獅", en: "lion", icon: "lion" },
  { zh: "猴", en: "monkey", icon: "monkey" },
];

export const FOODS: Word[] = [
  { zh: "蘋果", en: "apple", icon: "apple" },
  { zh: "香蕉", en: "banana", icon: "banana" },
  { zh: "橙", en: "orange", icon: "orange" },
  { zh: "牛奶", en: "milk", icon: "milk" },
  { zh: "麵包", en: "bread", icon: "bread" },
  { zh: "蛋", en: "egg", icon: "egg" },
  { zh: "飯", en: "rice", icon: "rice" },
  { zh: "水", en: "water", icon: "water" },
];

export const BODY: Word[] = [
  { zh: "頭", en: "head", icon: "head" },
  { zh: "眼", en: "eye", icon: "eye" },
  { zh: "耳", en: "ear", icon: "ear" },
  { zh: "鼻", en: "nose", icon: "nose" },
  { zh: "口", en: "mouth", icon: "mouth" },
  { zh: "手", en: "hand", icon: "hand" },
  { zh: "腳", en: "foot", icon: "foot" },
];

export const FAMILY: Word[] = [
  { zh: "爸爸", en: "Dad", icon: "dad" },
  { zh: "媽媽", en: "Mum", icon: "mom" },
  { zh: "哥哥", en: "older brother", icon: "brother" },
  { zh: "姐姐", en: "older sister", icon: "sister" },
  { zh: "弟弟", en: "younger brother", icon: "lilbro" },
  { zh: "妹妹", en: "younger sister", icon: "lilsis" },
];

export const COLORS: Word[] = [
  { zh: "紅色", en: "red", color: "#ef4444" },
  { zh: "黃色", en: "yellow", color: "#facc15" },
  { zh: "藍色", en: "blue", color: "#3b82f6" },
  { zh: "綠色", en: "green", color: "#22c55e" },
  { zh: "黑色", en: "black", color: "#1f2937" },
  { zh: "白色", en: "white", color: "#ffffff" },
];

export const colorChoice = (w: Word): Choice => c(w.zh, w.en, { color: w.color });

export const NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

export const WEATHER: Word[] = [
  { zh: "晴天", en: "sunny day", icon: "sun" },
  { zh: "雨天", en: "rainy day", icon: "rain" },
  { zh: "大風", en: "windy", icon: "wind" },
  { zh: "多雲", en: "cloudy", icon: "cloud" },
];

export const STROKES = [
  { zh: "橫", en: "horizontal stroke", icon: "stroke-h" },
  { zh: "豎", en: "vertical stroke", icon: "stroke-v" },
  { zh: "撇", en: "left-falling stroke", icon: "stroke-p" },
  { zh: "捺", en: "right-falling stroke", icon: "stroke-n" },
] as const;

export const strokeChoice = (zh: string): Choice => {
  const s = STROKES.find((x) => x.zh === zh)!;
  return c(s.zh, s.en, { icon: s.icon });
};

export const RADICALS = [
  { zh: "亻", en: "person radical" },
  { zh: "口", en: "mouth radical" },
  { zh: "木", en: "tree radical" },
  { zh: "氵", en: "water radical" },
  { zh: "火", en: "fire radical" },
  { zh: "日", en: "sun radical" },
  { zh: "月", en: "moon radical" },
  { zh: "扌", en: "hand radical" },
  { zh: "足", en: "foot radical" },
  { zh: "心", en: "heart radical" },
  { zh: "糸", en: "silk radical" },
];
export const radChoice = (zh: string): Choice => {
  const r = RADICALS.find((x) => x.zh === zh)!;
  return c(r.zh, r.en);
};
