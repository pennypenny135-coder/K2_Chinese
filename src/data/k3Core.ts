import { Bank, c, pick } from "./helpers";
import { RADICALS, ch, radChoice } from "./vocab";
import type { Word } from "./vocab";
import type { Choice } from "./types";

// 單字英文意思
const CE: Record<string, string> = {
  學: "study", 校: "school", 家: "home", 朋: "friend", 友: "friend", 老: "old", 師: "teacher", 書: "book", 包: "bag",
  飯: "rice / meal", 菜: "vegetable", 果: "fruit", 路: "road", 車: "car", 飛: "fly", 機: "machine",
  覺: "feel", 與: "and", 交: "hand over", 效: "effect", 字: "word", 象: "elephant", 明: "bright", 用: "use", 有: "have", 反: "opposite",
  考: "test", 者: "person", 帥: "handsome", 帶: "bring", 畫: "draw", 晝: "daytime", 句: "sentence", 色: "colour",
  飲: "drink", 飽: "full", 花: "flower", 草: "grass", 東: "east", 課: "lesson", 跑: "run", 腳: "foot", 軍: "army",
  風: "wind", 飄: "float", 幾: "how many", 樣: "kind",
  水: "water", 馬: "horse", 汽: "steam", 回: "return", 圖: "picture",
};
const cc = (z: string) => c(z, CE[z] ?? z);

export function addK3Core(b: Bank) {
  // ================= 認字 =================
  const KC = [
    { ch: "學", icon: "school", like: ["覺", "與"], ex: "學校" },
    { ch: "校", icon: "school", like: ["交", "效"], ex: "學校" },
    { ch: "家", icon: "house", like: ["字", "象"], ex: "回家" },
    { ch: "朋", icon: "friends", like: ["明", "用"], ex: "朋友" },
    { ch: "友", icon: "friends", like: ["有", "反"], ex: "朋友" },
    { ch: "老", icon: "teacher", like: ["考", "者"], ex: "老師" },
    { ch: "師", icon: "teacher", like: ["帥", "帶"], ex: "老師" },
    { ch: "書", icon: "book", like: ["畫", "晝"], ex: "圖書" },
    { ch: "包", icon: "bag", like: ["句", "色"], ex: "書包" },
    { ch: "飯", icon: "rice", like: ["飲", "飽"], ex: "吃飯" },
    { ch: "菜", icon: "tree", like: ["花", "草"], ex: "蔬菜", color: "#16a34a" },
    { ch: "果", icon: "apple", like: ["東", "課"], ex: "水果" },
    { ch: "路", icon: "road", like: ["跑", "腳"], ex: "馬路" },
    { ch: "車", icon: "car", like: ["東", "軍"], ex: "汽車" },
    { ch: "飛", icon: "plane", like: ["風", "飄"], ex: "飛機" },
    { ch: "機", icon: "plane", like: ["幾", "樣"], ex: "飛機" },
  ];
  const kcPool = KC.map((k) => ({ zh: k.ch }));
  KC.forEach((k) => {
    const extra = pick(kcPool, [k.ch], 1, b.n)[0];
    b.add({
      topic: "chars", d: 2,
      qz: `邊個係「${k.ch}」字？`,
      qe: `Which one is the character "${k.ch}" (${CE[k.ch]})?`,
      audio: `邊個係${k.ch}字？例如${k.ex}嘅${k.ch}。`,
      img: "icon", cfg: { name: k.icon, color: k.color, size: 110 },
      right: cc(k.ch), wrong: [cc(k.like[0]), cc(k.like[1]), cc(extra.zh)],
      ez: `「${k.ch}」可以組成「${k.ex}」。`,
      ee: `"${k.ch}" is used in the word "${k.ex}".`,
      tags: ["認字", "配詞", k.ch],
    });
  });

  // 填字成詞
  interface Comp { word: string; en: string; icon: string; blank: 0 | 1; wrong: string[]; color?: string }
  const COMP: Comp[] = [
    { word: "學校", en: "school", icon: "school", blank: 1, wrong: ["菜", "飛", "路"] },
    { word: "學校", en: "school", icon: "school", blank: 0, wrong: ["老", "友", "果"] },
    { word: "老師", en: "teacher", icon: "teacher", blank: 1, wrong: ["路", "飯", "機"] },
    { word: "老師", en: "teacher", icon: "teacher", blank: 0, wrong: ["書", "飛", "菜"] },
    { word: "朋友", en: "friend", icon: "friends", blank: 1, wrong: ["校", "車", "菜"] },
    { word: "朋友", en: "friend", icon: "friends", blank: 0, wrong: ["校", "包", "飛"] },
    { word: "書包", en: "school bag", icon: "bag", blank: 1, wrong: ["校", "路", "飛"] },
    { word: "書包", en: "school bag", icon: "bag", blank: 0, wrong: ["路", "車", "校"] },
    { word: "飯菜", en: "meal / dishes", icon: "rice", blank: 1, wrong: ["校", "路", "機"] },
    { word: "飯菜", en: "meal / dishes", icon: "rice", blank: 0, wrong: ["書", "車", "飛"] },
    { word: "水果", en: "fruit", icon: "apple", blank: 1, wrong: ["校", "包", "機"] },
    { word: "水果", en: "fruit", icon: "apple", blank: 0, wrong: ["書", "車", "飛"] },
    { word: "馬路", en: "road", icon: "road", blank: 1, wrong: ["校", "菜", "機"] },
    { word: "馬路", en: "road", icon: "road", blank: 0, wrong: ["書", "飛", "包"] },
    { word: "汽車", en: "car", icon: "car", blank: 1, wrong: ["校", "菜", "書"] },
    { word: "汽車", en: "car", icon: "car", blank: 0, wrong: ["書", "菜", "校"] },
    { word: "飛機", en: "aeroplane", icon: "plane", blank: 1, wrong: ["校", "菜", "書"] },
    { word: "飛機", en: "aeroplane", icon: "plane", blank: 0, wrong: ["書", "菜", "校"] },
    { word: "回家", en: "go home", icon: "house", blank: 1, wrong: ["菜", "書", "機"] },
  ];
  COMP.forEach((x) => {
    const [a, z] = [...x.word];
    const shown = x.blank === 1 ? `${a}（　）` : `（　）${z}`;
    const ans = x.blank === 1 ? z : a;
    b.add({
      topic: "chars", d: 2,
      qz: `填字成詞：${shown}`,
      qe: `Complete the word: ${x.blank === 1 ? a + " + ___" : "___ + " + z} (${x.en})`,
      audio: `填字成詞。${x.blank === 1 ? a : z}，要加咩字先成詞語？`,
      img: "icon", cfg: { name: x.icon, color: x.color, size: 100 },
      right: cc(ans), wrong: x.wrong.map(cc),
      ez: `「${a}」同「${z}」組成「${x.word}」。`,
      ee: `"${a}" + "${z}" makes "${x.word}" (${x.en}).`,
      tags: ["配詞", x.word],
    });
  });

  // ================= 部首與字形 =================
  const radPool = ["氵", "亻", "木", "口", "日", "月", "扌", "足", "心", "糸"].map((z) => ({ zh: z }));
  const RA_A = [
    { r: "氵", ch: "湖", en: "lake", avoid: ["月"] },
    { r: "亻", ch: "住", en: "live", avoid: [] as string[] },
    { r: "木", ch: "樹", en: "tree", avoid: ["口"] },
    { r: "口", ch: "喝", en: "drink", avoid: ["日"] },
    { r: "日", ch: "晚", en: "evening", avoid: [] },
    { r: "月", ch: "服", en: "clothes", avoid: [] },
    { r: "扌", ch: "推", en: "push", avoid: [] },
    { r: "足", ch: "路", en: "road", avoid: ["口"] },
    { r: "心", ch: "想", en: "think", avoid: ["木"] },
    { r: "糸", ch: "紅", en: "red", avoid: [] },
  ];
  const MEAN: Record<string, [string, string]> = {
    氵: ["同水有關", "related to water"], 亻: ["同人有關", "related to people"], 木: ["同樹木有關", "related to trees and wood"],
    口: ["同嘴巴有關", "related to the mouth"], 日: ["同太陽、日子有關", "related to the sun and days"],
    月: ["同月亮或身體有關", "related to the moon or the body"], 扌: ["同手嘅動作有關", "related to hand actions"],
    足: ["同腳有關", "related to feet"], 心: ["同心情、想法有關", "related to feelings and thoughts"], 糸: ["同線、布料、顏色有關", "related to thread, cloth and colour"],
  };
  RA_A.forEach((x) =>
    b.add({
      topic: "radicals", d: 2,
      qz: `「${x.ch}」字有咩部首？`, qe: `Which radical is in "${x.ch}" (${x.en})?`,
      img: "char", cfg: { text: x.ch },
      right: radChoice(x.r), wrong: pick(radPool, [x.r, ...x.avoid], 3, b.n).map((z) => radChoice(z.zh)),
      ez: `「${x.ch}」有部首「${x.r}」，${MEAN[x.r][0]}。`,
      ee: `"${x.ch}" has the radical "${x.r}", ${MEAN[x.r][1]}.`,
      tags: ["部首", x.r],
    }),
  );
  const RA_B = [
    { r: "氵", right: "洗", rEn: "wash", wrong: ["打", "想", "紅"] },
    { r: "亻", right: "做", rEn: "do", wrong: ["想", "洗", "紅"] },
    { r: "木", right: "椅", rEn: "chair", wrong: ["打", "紅", "洗"] },
    { r: "口", right: "吹", rEn: "blow", wrong: ["打", "洗", "想"] },
    { r: "日", right: "早", rEn: "early", wrong: ["洗", "紅", "打"] },
    { r: "月", right: "腳", rEn: "foot", wrong: ["洗", "紅", "想"] },
    { r: "扌", right: "抱", rEn: "hug", wrong: ["洗", "紅", "想"] },
    { r: "足", right: "跟", rEn: "follow", wrong: ["洗", "紅", "打"] },
    { r: "心", right: "愛", rEn: "love", wrong: ["打", "洗", "紅"] },
    { r: "糸", right: "綠", rEn: "green", wrong: ["洗", "打", "想"] },
  ];
  const EN3: Record<string, string> = { 打: "hit / play", 想: "think", 紅: "red", 洗: "wash" };
  RA_B.forEach((x) =>
    b.add({
      topic: "radicals", d: 2,
      qz: `邊個字有「${x.r}」部首？`, qe: `Which character has the ${radChoice(x.r).en} "${x.r}"?`,
      right: c(x.right, x.rEn), wrong: x.wrong.map((w) => c(w, EN3[w])),
      ez: `「${x.right}」有部首「${x.r}」，${MEAN[x.r][0]}。`,
      ee: `"${x.right}" has the radical "${x.r}", ${MEAN[x.r][1]}.`,
      tags: ["部首", x.r],
    }),
  );
  // 字形結構
  const STRUCT: Record<string, Choice> = {
    lr: c("左右結構", "left-right structure"),
    tb: c("上下結構", "top-bottom structure"),
    enclose: c("包圍結構", "enclosed structure"),
    single: c("獨體字", "single-part character"),
  };
  const others = (k: string) => Object.keys(STRUCT).filter((x) => x !== k).map((x) => STRUCT[x]);
  const SC: [string, string, string][] = [
    ["明", "lr", "bright"], ["好", "lr", "good"], ["休", "lr", "rest"],
    ["星", "tb", "star"], ["字", "tb", "word"], ["花", "tb", "flower"],
    ["國", "enclose", "country"], ["回", "enclose", "return"], ["問", "enclose", "ask"],
    ["山", "single", "mountain"], ["日", "single", "sun"], ["人", "single", "person"],
  ];
  SC.forEach(([chr, k, en]) =>
    b.add({
      topic: "radicals", d: 3,
      qz: `「${chr}」字係咩結構？`, qe: `What is the structure of "${chr}" (${en})?`,
      img: "char", cfg: { text: chr },
      right: STRUCT[k], wrong: others(k),
      ez: `「${chr}」係${STRUCT[k].zh}。`, ee: `"${chr}" is a ${STRUCT[k].en}.`,
      tags: ["字形結構", STRUCT[k].zh, chr],
    }),
  );
  (["lr", "tb", "enclose"] as const).forEach((k) =>
    b.add({
      topic: "radicals", d: 2,
      qz: "呢個圖係咩字形結構？", qe: "Which character structure does this picture show?",
      img: "structure", cfg: { kind: k },
      right: STRUCT[k], wrong: others(k),
      ez: `呢個圖係${STRUCT[k].zh}。`, ee: `The picture shows a ${STRUCT[k].en}.`,
      tags: ["字形結構", STRUCT[k].zh],
    }),
  );
  const WHICH: { k: "lr" | "tb" | "enclose"; right: string; wrong: string[] }[] = [
    { k: "lr", right: "朋", wrong: ["星", "國", "字"] },
    { k: "tb", right: "花", wrong: ["明", "回", "休"] },
    { k: "enclose", right: "因", wrong: ["好", "草", "林"] },
  ];
  const WE: Record<string, string> = { 朋: "friend", 星: "star", 國: "country", 字: "word", 花: "flower", 明: "bright", 回: "return", 休: "rest", 因: "because", 好: "good", 草: "grass", 林: "forest" };
  WHICH.forEach((w) =>
    b.add({
      topic: "radicals", d: 3,
      qz: `邊個字係${STRUCT[w.k].zh}？`, qe: `Which character has a ${STRUCT[w.k].en}?`,
      right: c(w.right, WE[w.right]), wrong: w.wrong.map((x) => c(x, WE[x])),
      ez: `「${w.right}」係${STRUCT[w.k].zh}。`, ee: `"${w.right}" has a ${STRUCT[w.k].en}.`,
      tags: ["字形結構", STRUCT[w.k].zh],
    }),
  );

  // ================= 詞語 =================
  interface W3 extends Word { clue: string; clueEn: string }
  const W3: W3[] = [
    { zh: "太陽", en: "sun", icon: "sun", clue: "白天喺天上發光，令世界好光亮。", clueEn: "It shines in the sky by day and makes everything bright." },
    { zh: "月亮", en: "moon", icon: "moon", clue: "夜晚喺天上，有時圓有時彎。", clueEn: "It is in the night sky, sometimes round and sometimes curved." },
    { zh: "星星", en: "stars", icon: "star", clue: "夜晚天上好多閃閃發光嘅小點。", clueEn: "Tiny sparkling lights in the night sky." },
    { zh: "學校", en: "school", icon: "school", clue: "小朋友每日上課嘅地方。", clueEn: "The place where children have lessons every day." },
    { zh: "老師", en: "teacher", icon: "teacher", clue: "喺學校教我哋讀書嘅人。", clueEn: "The person who teaches us at school." },
    { zh: "朋友", en: "friends", icon: "friends", clue: "同我一齊玩、互相幫助嘅人。", clueEn: "People who play with me and help each other." },
    { zh: "圖書", en: "books", icon: "book", clue: "有好多圖畫同故事，可以睇嘅。", clueEn: "They have pictures and stories we can read." },
    { zh: "文具", en: "stationery", icon: "stationery", clue: "筆、尺、擦膠都係呢一類。", clueEn: "Pens, rulers and erasers all belong here." },
  ];
  W3.forEach((w) =>
    b.add({
      topic: "words", d: 2,
      qz: "呢個係咩詞語？", qe: "Which word matches the picture?",
      img: "icon", cfg: { name: w.icon, size: 120 },
      right: ch(w, false), wrong: pick(W3, [w.zh], 3, b.n).map((x) => ch(x, false)),
      ez: `呢個係「${w.zh}」。`, ee: `This is "${w.zh}" (${w.en}).`,
      tags: ["詞語配對", w.zh],
    }),
  );
  W3.forEach((w) =>
    b.add({
      topic: "words", d: 2,
      qz: `${w.clue}係咩？`, qe: `${w.clueEn} What is it?`,
      right: ch(w), wrong: pick(W3, [w.zh], 3, b.n + 1).map((x) => ch(x)),
      ez: `答案係「${w.zh}」。`, ee: `The answer is "${w.zh}" (${w.en}).`,
      tags: ["詞語配對", w.zh],
    }),
  );

  // 反義詞
  const OPP: [string, string, string, string][] = [
    ["快", "慢", "fast", "slow"], ["高", "矮", "tall", "short"], ["熱", "冷", "hot", "cold"], ["開心", "難過", "happy", "sad"],
  ];
  const oppPool = OPP.flatMap(([a, z, ae, ze]) => [c(a, ae), c(z, ze)]);
  OPP.forEach(([a, z, ae, ze]) => {
    ([[a, z, ae, ze], [z, a, ze, ae]] as [string, string, string, string][]).forEach(([x, y, xe, ye]) =>
      b.add({
        topic: "words", d: 2,
        qz: `「${x}」嘅反義詞係咩？`, qe: `What is the opposite of "${x}" (${xe})?`,
        img: "char", cfg: { text: x },
        right: c(y, ye), wrong: pick(oppPool, [x, y], 3, b.n),
        ez: `「${x}」同「${y}」係相反嘅意思。`, ee: `"${x}" (${xe}) and "${y}" (${ye}) are opposites.`,
        tags: ["反義詞", x, y],
      }),
    );
  });
  const SYN = [
    { w: "開心", we: "happy", right: c("高興", "glad"), wrong: [c("難過", "sad"), c("慢", "slow"), c("冷", "cold")] },
    { w: "漂亮", we: "pretty", right: c("美麗", "beautiful"), wrong: [c("快", "fast"), c("冷", "cold"), c("高", "tall")] },
    { w: "細", we: "small", right: c("小", "little"), wrong: [c("大", "big"), c("高", "tall"), c("熱", "hot")] },
    { w: "立刻", we: "at once", right: c("馬上", "right away"), wrong: [c("慢慢", "slowly"), c("明天", "tomorrow"), c("昨日", "yesterday")] },
  ];
  SYN.forEach((s) =>
    b.add({
      topic: "words", d: 3,
      qz: `「${s.w}」嘅近義詞係咩？`, qe: `Which word means almost the same as "${s.w}" (${s.we})?`,
      img: "char", cfg: { text: s.w },
      right: s.right, wrong: s.wrong,
      ez: `「${s.w}」同「${s.right.zh}」意思差不多。`, ee: `"${s.w}" and "${s.right.zh}" have similar meanings.`,
      tags: ["近義詞", s.w],
    }),
  );

  // 數字 11-20 與數量
  const N20 = ["十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];
  const numZh = (n: number) => (n <= 10 ? ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][n - 1] : N20[n - 11]);
  const nearK = (n: number, lo: number, hi: number) =>
    [n - 1, n + 1, n - 2, n + 2, n + 3, n - 3].filter((x) => x >= lo && x <= hi && x !== n).map((x) => ({ zh: numZh(x), en: String(x) }));
  const CI = ["apple", "star", "balloon", "fish", "flower", "ball", "banana", "car", "cat", "bird"];
  for (let n = 11; n <= 20; n++) {
    b.add({
      topic: "words", d: 3,
      qz: ["數一數，一共有幾多？", "圖入面有幾多個？"][n % 2], qe: "Count them. How many are there?",
      img: "count", cfg: { name: CI[n - 11], count: n },
      right: c(numZh(n), String(n)), wrong: pick(nearK(n, 11, 20), [], 3, b.n).map((x) => c(x.zh, x.en)),
      ez: `一共有${numZh(n)}個，即係 ${n} 個。`, ee: `There are ${n} in total.`,
      tags: ["數字", numZh(n)],
    });
  }
  [6, 8, 10, 12, 14, 15, 16, 18, 19, 20].forEach((n) =>
    b.add({
      topic: "words", d: 3,
      qz: `「${numZh(n)}」係幾多？`, qe: `What number is "${numZh(n)}"?`,
      img: "char", cfg: { text: numZh(n) },
      right: c(String(n), numZh(n)), wrong: pick(nearK(n, 1, 20), [], 3, b.n).map((x) => c(x.en, x.zh)),
      ez: `「${numZh(n)}」就係 ${n}。`, ee: `"${numZh(n)}" is ${n}.`,
      tags: ["數字", numZh(n)],
    }),
  );
  const MORE: { icon: string; counts: number[]; name: string }[] = [
    { icon: "apple", counts: [9, 3, 5, 6], name: "蘋果" },
    { icon: "star", counts: [8, 4, 2, 5], name: "星星" },
    { icon: "balloon", counts: [7, 3, 4, 2], name: "氣球" },
    { icon: "fish", counts: [10, 6, 5, 7], name: "魚" },
  ];
  MORE.forEach((m) => {
    const [r, ...ws] = m.counts;
    b.add({
      topic: "words", d: 2,
      qz: "邊一組嘅數量最多？", qe: "Which group has the most?",
      style: "icon",
      right: c(`${numZh(r)}個`, `${r}`, { icon: m.icon, count: r }),
      wrong: ws.map((n) => c(`${numZh(n)}個`, `${n}`, { icon: m.icon, count: n })),
      ez: `${r} 個最多。`, ee: `${r} is the most.`,
      tags: ["數量", "比較"],
    });
  });

  // 星期與時間
  const WK = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
  const WKE = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const wkC = (i: number) => c(WK[(i + 7) % 7], WKE[(i + 7) % 7]);
  for (let i = 0; i < 7; i++) {
    b.add({
      topic: "words", d: 2,
      qz: `${WK[i]}之後係星期幾？`, qe: `What day comes after ${WKE[i]}?`,
      right: wkC(i + 1),
      wrong: pick(WK.map((_, k) => wkC(k)), [WK[i], WK[(i + 1) % 7]], 3, b.n),
      ez: `${WK[i]}之後係${WK[(i + 1) % 7]}。`, ee: `${WKE[(i + 1) % 7]} comes after ${WKE[i]}.`,
      tags: ["星期", WK[i]],
    });
  }
  [2, 4, 6].forEach((i) =>
    b.add({
      topic: "words", d: 2,
      qz: `${WK[i]}之前一日係星期幾？`, qe: `What day comes before ${WKE[i]}?`,
      right: wkC(i - 1),
      wrong: pick(WK.map((_, k) => wkC(k)), [WK[i], WK[i - 1]], 3, b.n + 1),
      ez: `${WK[i]}之前一日係${WK[i - 1]}。`, ee: `${WKE[i - 1]} comes before ${WKE[i]}.`,
      tags: ["星期", WK[i]],
    }),
  );
  const TIMES = [c("早上", "morning"), c("中午", "noon"), c("下午", "afternoon"), c("晚上", "evening / night")];
  const tOthers = (zh: string) => TIMES.filter((t) => t.zh !== zh);
  const TQ: { qz: string; qe: string; ans: string; img?: "scene"; cfg?: Record<string, unknown>; ez: string; ee: string }[] = [
    { qz: "太陽出嚟，小朋友起身刷牙返學。係一日入面嘅咩時候？", qe: "The sun rises and children brush their teeth for school. What time of day is it?", ans: "早上", img: "scene", cfg: { bg: "sunset", items: [{ icon: "sun", x: 30, y: 40, s: 60 }, { icon: "kid", x: 150, y: 50, s: 80 }, { icon: "bag", x: 230, y: 70, s: 50 }] }, ez: "起身返學係早上。", ee: "Getting up for school happens in the morning." },
    { qz: "天黑了，月亮同星星出嚟。係一日入面嘅咩時候？", qe: "It is dark and the moon and stars are out. What time of day is it?", ans: "晚上", img: "scene", cfg: { bg: "night", items: [{ icon: "moon", x: 190, y: 10, s: 70 }, { icon: "star", x: 60, y: 20, s: 30 }, { icon: "star", x: 120, y: 44, s: 24 }, { icon: "house", x: 40, y: 56, s: 80 }] }, ez: "有月亮同星星係晚上。", ee: "The moon and stars come out in the evening." },
    { qz: "放學後，小朋友喺公園玩。係一日入面嘅咩時候？", qe: "After school children play in the park. What time of day is it?", ans: "下午", img: "scene", cfg: { bg: "park", items: [{ icon: "sun", x: 220, y: 6, s: 50 }, { icon: "tree", x: 20, y: 34, s: 86 }, { icon: "kid", x: 130, y: 60, s: 80 }] }, ez: "放學後係下午。", ee: "After school is the afternoon." },
    { qz: "食早餐係一日入面嘅咩時候？", qe: "When do we eat breakfast?", ans: "早上", img: "scene", cfg: { bg: "room", items: [{ icon: "bread", x: 80, y: 60, s: 60 }, { icon: "milk", x: 170, y: 56, s: 64 }] }, ez: "早餐喺早上食。", ee: "We eat breakfast in the morning." },
    { qz: "睇星星係一日入面嘅咩時候？", qe: "When can we see the stars?", ans: "晚上", img: "scene", cfg: { bg: "night", items: [{ icon: "star", x: 60, y: 20, s: 40 }, { icon: "star", x: 150, y: 40, s: 30 }, { icon: "star", x: 220, y: 14, s: 36 }] }, ez: "星星喺晚上出現。", ee: "Stars appear in the evening." },
    { qz: "太陽最高，大家食午飯。係一日入面嘅咩時候？", qe: "The sun is highest and everyone eats lunch. What time of day is it?", ans: "中午", img: "scene", cfg: { bg: "park", items: [{ icon: "sun", x: 120, y: 2, s: 70 }, { icon: "rice", x: 120, y: 80, s: 50 }] }, ez: "食午飯係中午。", ee: "Lunch time is noon." },
    { qz: "刷牙之後，同爸爸媽媽講晚安，跟住瞓覺。係一日入面嘅咩時候？", qe: "After brushing teeth you say good night and go to sleep. What time of day is it?", ans: "晚上", img: "scene", cfg: { bg: "room", items: [{ icon: "bed", x: 100, y: 52, s: 90 }, { icon: "moon", x: 220, y: 10, s: 50 }] }, ez: "瞓覺前係晚上。", ee: "Bedtime is in the evening." },
  ];
  TQ.forEach((t) => {
    const right = TIMES.find((x) => x.zh === t.ans)!;
    b.add({
      topic: "words", d: 2, qz: t.qz, qe: t.qe, img: t.img ?? "none", cfg: t.cfg ?? {},
      right, wrong: tOthers(t.ans), ez: t.ez, ee: t.ee, tags: ["時間", t.ans],
    });
  });

  // 方位
  const POS = [
    { rel: "on", ans: c("上面", "above / on top"), obj: "cat", ref: "table", refZh: "枱", ez: "貓喺枱嘅上面。" },
    { rel: "under", ans: c("下面", "below / under"), obj: "cat", ref: "table", refZh: "枱", ez: "貓喺枱嘅下面。" },
    { rel: "left", ans: c("左邊", "left"), obj: "bird", ref: "tree", refZh: "樹", ez: "小鳥喺樹嘅左邊。" },
    { rel: "right", ans: c("右邊", "right"), obj: "rabbit", ref: "tree", refZh: "樹", ez: "小兔喺樹嘅右邊。" },
    { rel: "front", ans: c("前面", "in front"), obj: "cat", ref: "dog", refZh: "狗", ez: "貓喺狗嘅前面。" },
    { rel: "behind", ans: c("後面", "behind"), obj: "cat", ref: "dog", refZh: "狗", ez: "貓喺狗嘅後面。" },
    { rel: "inside", ans: c("裡面", "inside"), obj: "rabbit", ref: "box", refZh: "箱", ez: "小兔喺箱嘅裡面。" },
    { rel: "outside", ans: c("外面", "outside"), obj: "bird", ref: "box", refZh: "箱", ez: "小鳥喺箱嘅外面。" },
  ];
  const posPool = POS.map((p) => p.ans);
  const OBJN: Record<string, [string, string]> = { cat: ["貓", "cat"], bird: ["小鳥", "bird"], rabbit: ["小兔", "rabbit"] };
  POS.forEach((p) =>
    b.add({
      topic: "words", d: 2,
      qz: `${OBJN[p.obj][0]}喺${p.refZh}嘅邊度？`, qe: `Where is the ${OBJN[p.obj][1]}?`,
      img: "position", cfg: { rel: p.rel, obj: p.obj, ref: p.ref },
      right: p.ans, wrong: pick(posPool, [p.ans.zh], 3, b.n),
      ez: p.ez, ee: `The ${OBJN[p.obj][1]} is ${p.ans.en}.`,
      tags: ["方位", p.ans.zh],
    }),
  );

  void RADICALS;
}
