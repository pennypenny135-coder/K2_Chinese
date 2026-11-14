export type Level = "K2" | "K3";

export type TopicId =
  | "chars"
  | "radicals"
  | "words"
  | "measure"
  | "sentences"
  | "listening"
  | "story"
  | "life";

export type ImageType =
  | "none"
  | "char" // 中文字卡
  | "radical" // 部首卡
  | "icon" // 單一圖形
  | "count" // 數量圖形
  | "stroke" // 筆順示意
  | "structure" // 字形結構圖
  | "position" // 方位圖
  | "scene"; // 場景

export interface Choice {
  zh: string;
  en: string;
  /** 選項上顯示嘅內建 SVG 圖形名稱 */
  icon?: string;
  iconColor?: string;
  count?: number;
  /** 顏色選項（色塊） */
  color?: string;
}

export interface Question {
  id: string;
  level: Level;
  topic: string; // 中文主題名
  topicEn: string;
  topicId: TopicId;
  difficulty: 1 | 2 | 3;
  questionZh: string;
  questionEn: string;
  audioText: string;
  imageType: ImageType;
  imageConfig: Record<string, unknown>;
  choices: [Choice, Choice, Choice, Choice];
  correctIndex: number;
  explanationZh: string;
  explanationEn: string;
  tags: string[];
  /** text：顯示文字；icon：只顯示圖（答完先顯示文字）；color：色塊 */
  /** swatch：只顯示色塊（答完先顯示文字） */
  choiceStyle?: "text" | "icon" | "color" | "swatch";
}
