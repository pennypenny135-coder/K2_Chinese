import { Bank, c, pick } from "./helpers";
import {
  ANIMALS, BODY, COLORS, FAMILY, FOODS, NUMS, RADICALS, STROKES, WEATHER,
  ch, colorChoice, radChoice, strokeChoice,
  type Word,
} from "./vocab";

// 單字英文意思（包括干擾字）
const CHEN: Record<string, string> = {
  人: "person", 大: "big", 小: "small", 上: "up", 下: "down", 日: "sun / day", 月: "moon", 水: "water", 火: "fire",
  山: "mountain", 木: "tree", 口: "mouth", 手: "hand", 足: "foot", 心: "heart",
  入: "enter", 八: "eight", 太: "too / very", 犬: "dog", 少: "few", 止: "stop", 不: "not", 目: "eye", 用: "use",
  永: "forever", 出: "go out", 田: "field", 本: "book / root", 禾: "grain", 毛: "hair", 牛: "cow", 走: "walk",
  是: "is", 必: "must",
};
const cc = (z: string) => c(z, CHEN[z] ?? z);

export function addK2Core(b: Bank) {
  // ================= 認字 =================
  const HF = [
    { ch: "人", ex: "大人", exEn: "adult", like: ["入", "八"], icon: "kid" },
    { ch: "大", ex: "大象", exEn: "big elephant", like: ["太", "犬"] },
    { ch: "小", ex: "小鳥", exEn: "little bird", like: ["少", "水"] },
    { ch: "上", ex: "上山", exEn: "go up the hill", like: ["下", "止"] },
    { ch: "下", ex: "下雨", exEn: "it rains", like: ["上", "不"] },
    { ch: "日", ex: "日出", exEn: "sunrise", like: ["月", "目"], icon: "sun" },
    { ch: "月", ex: "月亮", exEn: "moon", like: ["日", "用"], icon: "moon" },
    { ch: "水", ex: "飲水", exEn: "drink water", like: ["永", "小"], icon: "drop" },
    { ch: "火", ex: "火車", exEn: "train", like: ["大", "人"], icon: "fire" },
    { ch: "山", ex: "高山", exEn: "high mountain", like: ["出", "田"], icon: "mountain" },
    { ch: "木", ex: "樹木", exEn: "trees", like: ["本", "禾"], icon: "tree" },
    { ch: "口", ex: "開口", exEn: "open the mouth", like: ["日", "田"], icon: "mouth" },
    { ch: "手", ex: "拍手", exEn: "clap hands", like: ["毛", "牛"], icon: "hand" },
    { ch: "足", ex: "手足", exEn: "hands and feet", like: ["走", "是"], icon: "foot" },
    { ch: "心", ex: "開心", exEn: "happy", like: ["必", "少"], icon: "heart" },
  ];
  const hfPool = HF.map((h) => ({ zh: h.ch }));
  HF.forEach((h) => {
    const extra = pick(hfPool.filter((x) => !h.like.includes(x.zh)), [h.ch], 1, b.n)[0];
    b.add({
      topic: "chars", d: 1,
      qz: `邊個係「${h.ch}」字？`,
      qe: `Which one is the character "${h.ch}" (${CHEN[h.ch]})?`,
      audio: `邊個係${h.ch}字？${h.ch}。`,
      img: h.icon ? "icon" : "none",
      cfg: h.icon ? { name: h.icon, size: 110 } : {},
      right: cc(h.ch),
      wrong: [cc(h.like[0]), cc(h.like[1]), cc(extra.zh)],
      ez: `「${h.ch}」就係「${h.ex}」嘅「${h.ch}」。`,
      ee: `"${h.ch}" means ${CHEN[h.ch]}, as in ${h.ex} (${h.exEn}).`,
      tags: ["高頻字", "認讀", h.ch],
    });
  });

  const PICS = [
    { ch: "人", zh: "人", en: "person", icon: "kid" },
    { ch: "日", zh: "太陽", en: "sun", icon: "sun" },
    { ch: "月", zh: "月亮", en: "moon", icon: "moon" },
    { ch: "水", zh: "水", en: "water drop", icon: "drop" },
    { ch: "火", zh: "火", en: "fire", icon: "fire" },
    { ch: "山", zh: "山", en: "mountain", icon: "mountain" },
    { ch: "木", zh: "樹", en: "tree", icon: "tree" },
    { ch: "口", zh: "口", en: "mouth", icon: "mouth" },
    { ch: "手", zh: "手", en: "hand", icon: "hand" },
    { ch: "足", zh: "腳", en: "foot", icon: "foot" },
    { ch: "心", zh: "心", en: "heart", icon: "heart" },
  ];
  PICS.forEach((p) => {
    const wr = pick(PICS, [p.zh], 3, b.n);
    b.add({
      topic: "chars", d: 2,
      qz: "呢個字代表邊幅圖？",
      qe: "Which picture matches this character?",
      audio: `呢個字代表邊幅圖？${p.ch}。`,
      img: "char", cfg: { text: p.ch },
      style: "icon",
      right: c(p.zh, p.en, { icon: p.icon }),
      wrong: wr.map((w) => c(w.zh, w.en, { icon: w.icon })),
      ez: `「${p.ch}」字就係畫成${p.zh}嘅樣子。`,
      ee: `The character "${p.ch}" matches the picture of ${p.en}.`,
      tags: ["象形字", "字圖配對", p.ch],
    });
  });

  const PW: (Word & { color?: string })[] = [
    { zh: "蘋果", en: "apple", icon: "apple" },
    { zh: "香蕉", en: "banana", icon: "banana" },
    { zh: "貓", en: "cat", icon: "cat" },
    { zh: "狗", en: "dog", icon: "dog" },
    { zh: "魚", en: "fish", icon: "fish" },
    { zh: "車", en: "car", icon: "car", color: "#3b82f6" },
    { zh: "屋", en: "house", icon: "house" },
    { zh: "花", en: "flower", icon: "flower", color: "#fb7185" },
    { zh: "樹", en: "tree", icon: "tree" },
    { zh: "星", en: "star", icon: "star" },
  ];
  const picQ = ["呢個係咩？", "圖入面係咩？"];
  PW.forEach((w, i) => {
    b.add({
      topic: "chars", d: 1,
      qz: picQ[i % 2], qe: i % 2 ? "What is in the picture?" : "What is this?",
      img: "icon", cfg: { name: w.icon, color: w.color, size: 130 },
      right: ch(w, false),
      wrong: pick(PW, [w.zh], 3, b.n).map((x) => ch(x, false)),
      ez: `呢個係「${w.zh}」。`, ee: `This is "${w.zh}" (${w.en}).`,
      tags: ["看圖選字", w.zh],
    });
  });

  // ================= 部首筆順 =================
  const RA_A = [
    { r: "亻", ch: "你", en: "you", avoid: [] as string[] },
    { r: "口", ch: "叫", en: "call", avoid: [] },
    { r: "木", ch: "桌", en: "table", avoid: [] },
    { r: "氵", ch: "海", en: "sea", avoid: [] },
    { r: "火", ch: "燒", en: "burn / cook", avoid: [] },
    { r: "日", ch: "星", en: "star", avoid: ["月"] },
    { r: "月", ch: "肚", en: "tummy", avoid: [] },
    { r: "扌", ch: "拍", en: "pat / clap", avoid: [] },
    { r: "足", ch: "跳", en: "jump", avoid: [] },
  ];
  const nineRad = ["亻", "口", "木", "氵", "火", "日", "月", "扌", "足"].map((z) => ({ zh: z }));
  RA_A.forEach((x) => {
    b.add({
      topic: "radicals", d: 2,
      qz: `「${x.ch}」字入面有咩部首？`,
      qe: `Which radical is inside "${x.ch}" (${x.en})?`,
      img: "radical", cfg: { text: x.ch, label: "部首 radical?" },
      right: radChoice(x.r),
      wrong: pick(nineRad, [x.r, ...x.avoid], 3, b.n).map((z) => radChoice(z.zh)),
      ez: `「${x.ch}」字有部首「${x.r}」。`,
      ee: `"${x.ch}" contains the ${radChoice(x.r).en} "${x.r}".`,
      tags: ["部首", x.r],
    });
  });

  const RA_B = [
    { r: "亻", right: "休", wrong: ["吃", "河", "打"] },
    { r: "口", right: "吃", wrong: ["休", "打", "林"] },
    { r: "木", right: "林", wrong: ["吃", "河", "跑"] },
    { r: "氵", right: "河", wrong: ["打", "休", "跑"] },
    { r: "火", right: "炒", wrong: ["河", "吃", "林"] },
    { r: "日", right: "晴", wrong: ["打", "河", "休"] },
    { r: "月", right: "朋", wrong: ["打", "休", "河"] },
    { r: "扌", right: "打", wrong: ["休", "河", "吃"] },
    { r: "足", right: "跑", wrong: ["打", "林", "吃"] },
  ];
  const EN2: Record<string, string> = { 休: "rest", 吃: "eat", 林: "forest", 河: "river", 炒: "stir-fry", 晴: "sunny", 朋: "friend", 打: "hit / play", 跑: "run" };
  RA_B.forEach((x) => {
    b.add({
      topic: "radicals", d: 2,
      qz: `邊個字有「${x.r}」部首？`,
      qe: `Which character has the ${radChoice(x.r).en} "${x.r}"?`,
      right: c(x.right, EN2[x.right]),
      wrong: x.wrong.map((w) => c(w, EN2[w])),
      ez: `「${x.right}」字有部首「${x.r}」。`,
      ee: `"${x.right}" has the ${radChoice(x.r).en}.`,
      tags: ["部首", x.r],
    });
  });

  // 筆順：第一劃 / 第二劃
  const strokeOthers = (zh: string) => STROKES.filter((s) => s.zh !== zh).map((s) => strokeChoice(s.zh));
  const FIRST: { ch: string; first: string; rule: string; ruleEn: string }[] = [
    { ch: "十", first: "橫", rule: "先橫後豎", ruleEn: "horizontal before vertical" },
    { ch: "土", first: "橫", rule: "先橫後豎", ruleEn: "horizontal before vertical" },
    { ch: "工", first: "橫", rule: "先橫後豎", ruleEn: "horizontal before vertical" },
    { ch: "人", first: "撇", rule: "先撇後捺", ruleEn: "left-falling before right-falling" },
    { ch: "八", first: "撇", rule: "先撇後捺", ruleEn: "left-falling before right-falling" },
    { ch: "入", first: "撇", rule: "先撇後捺", ruleEn: "left-falling before right-falling" },
  ];
  FIRST.forEach((x) =>
    b.add({
      topic: "radicals", d: 2,
      qz: `寫「${x.ch}」字，第一劃係邊一劃？`,
      qe: `When writing "${x.ch}", which stroke comes first?`,
      img: "char", cfg: { text: x.ch },
      right: strokeChoice(x.first), wrong: strokeOthers(x.first),
      ez: `筆順規則「${x.rule}」：「${x.ch}」字先寫${x.first}。`,
      ee: `Stroke rule "${x.ruleEn}": write the ${x.first} stroke of "${x.ch}" first.`,
      tags: ["筆順", x.rule, x.ch],
    }),
  );
  const SECOND = [
    { ch: "十", second: "豎", rule: "先橫後豎", ruleEn: "horizontal before vertical" },
    { ch: "人", second: "捺", rule: "先撇後捺", ruleEn: "left-falling before right-falling" },
    { ch: "大", second: "撇", rule: "先橫後撇捺", ruleEn: "horizontal first, then left- and right-falling" },
  ];
  SECOND.forEach((x) =>
    b.add({
      topic: "radicals", d: 2,
      qz: `寫「${x.ch}」字，第二劃係邊一劃？`,
      qe: `When writing "${x.ch}", which stroke comes second?`,
      img: "char", cfg: { text: x.ch },
      right: strokeChoice(x.second), wrong: strokeOthers(x.second),
      ez: `筆順規則「${x.rule}」：「${x.ch}」字第二劃係${x.second}。`,
      ee: `Stroke rule "${x.ruleEn}": the second stroke of "${x.ch}" is the ${x.second}.`,
      tags: ["筆順", x.rule, x.ch],
    }),
  );
  // 由上至下
  const TD = [
    { ch: "二", right: c("上面嗰橫", "the top stroke"), wrong: [c("下面嗰橫", "the bottom stroke"), c("兩橫一齊寫", "both at once"), c("由右至左寫", "from right to left")] },
    { ch: "三", right: c("最上面嗰橫", "the very top stroke"), wrong: [c("最下面嗰橫", "the bottom stroke"), c("中間嗰橫", "the middle stroke"), c("三橫一齊寫", "all three at once")] },
    { ch: "天", right: c("上面嘅橫", "the top strokes"), wrong: [c("下面嘅撇捺", "the bottom strokes"), c("一齊寫", "all at once"), c("由下至上寫", "from bottom to top")] },
  ];
  TD.forEach((x) =>
    b.add({
      topic: "radicals", d: 2,
      qz: `寫「${x.ch}」字，應該先寫邊度？`,
      qe: `When writing "${x.ch}", where do we start?`,
      img: "char", cfg: { text: x.ch },
      right: x.right, wrong: x.wrong,
      ez: "筆順規則「由上至下」：先寫上面，再寫下面。",
      ee: 'Stroke rule "top to bottom": write the top first, then the bottom.',
      tags: ["筆順", "由上至下", x.ch],
    }),
  );
  // 由左至右
  const LR = ["川", "林", "明"];
  LR.forEach((chr, i) =>
    b.add({
      topic: "radicals", d: 2,
      qz: `寫「${chr}」字，先寫邊一邊？`,
      qe: `When writing "${chr}", which side is written first?`,
      img: "char", cfg: { text: chr },
      right: c("左邊", "the left side"),
      wrong: i === 0
        ? [c("右邊", "the right side"), c("中間", "the middle"), c("一齊寫", "all at once")]
        : [c("右邊", "the right side"), c("上面", "the top"), c("下面", "the bottom")],
      ez: "筆順規則「由左至右」：先寫左邊，再寫右邊。",
      ee: 'Stroke rule "left to right": write the left side first, then the right.',
      tags: ["筆順", "由左至右", chr],
    }),
  );
  // 認識筆畫
  const STROKE_DESC: Record<string, [string, string]> = {
    橫: ["由左到右嘅直線", "a straight line from left to right"],
    豎: ["由上到下嘅直線", "a straight line from top to bottom"],
    撇: ["由右上向左下嘅斜線", "a slanting line from upper right to lower left"],
    捺: ["由左上向右下嘅斜線", "a slanting line from upper left to lower right"],
  };
  STROKES.forEach((s) =>
    b.add({
      topic: "radicals", d: 1,
      qz: `邊一個係「${s.zh}」？`,
      qe: `Which one is the ${s.en}?`,
      style: "icon",
      right: strokeChoice(s.zh), wrong: strokeOthers(s.zh),
      ez: `「${s.zh}」係${STROKE_DESC[s.zh][0]}。`,
      ee: `The ${s.en} is ${STROKE_DESC[s.zh][1]}.`,
      tags: ["筆畫", s.zh],
    }),
  );

  // ================= 詞語 =================
  // 反義詞
  const OPP: [string, string, string, string][] = [
    ["大", "小", "big", "small"], ["上", "下", "up", "down"], ["多", "少", "many", "few"],
    ["長", "短", "long", "short"], ["開", "關", "open", "close"],
  ];
  const oppPool = OPP.flatMap(([a, z, ae, ze]) => [c(a, ae), c(z, ze)]);
  OPP.forEach(([a, z, ae, ze]) => {
    ([[a, z, ae, ze], [z, a, ze, ae]] as [string, string, string, string][]).forEach(([x, y, xe, ye]) =>
      b.add({
        topic: "words", d: 1,
        qz: `「${x}」嘅反義詞係咩？`,
        qe: `What is the opposite of "${x}" (${xe})?`,
        img: "char", cfg: { text: x },
        right: c(y, ye),
        wrong: pick(oppPool, [x, y], 3, b.n),
        ez: `「${x}」同「${y}」係相反嘅意思。`,
        ee: `"${x}" (${xe}) and "${y}" (${ye}) are opposites.`,
        tags: ["反義詞", x, y],
      }),
    );
  });

  // 顏色詞
  const COLOR_OBJ = [
    { icon: "apple", name: "蘋果" }, { icon: "banana", name: "香蕉" }, { icon: "balloon", name: "氣球" },
    { icon: "tree", name: "樹" }, { icon: "cat", name: "貓" }, { icon: "rabbit", name: "兔" },
  ];
  COLORS.forEach((col, i) => {
    const o = COLOR_OBJ[i];
    const iconColor = col.zh === "黑色" ? "#374151" : col.color;
    b.add({
      topic: "words", d: 1,
      qz: ["呢個係咩顏色？", "佢係咩顏色？"][i % 2], qe: "What colour is it?",
      img: "icon", cfg: { name: o.icon, color: iconColor, size: 130 },
      style: "color",
      right: colorChoice(col), wrong: pick(COLORS, [col.zh], 3, b.n).map(colorChoice),
      ez: `呢個係${col.zh}。`, ee: `This is ${col.en}.`,
      tags: ["顏色", col.zh],
    });
    b.add({
      topic: "words", d: 1,
      qz: `邊個係「${col.zh}」？`, qe: `Which one is ${col.en}?`,
      style: "swatch",
      right: colorChoice(col), wrong: pick(COLORS, [col.zh], 3, b.n + 2).map(colorChoice),
      ez: `「${col.zh}」就係${col.en}色。`, ee: `"${col.zh}" is the colour ${col.en}.`,
      tags: ["顏色", col.zh],
    });
  });

  // 數字 一至十
  const near = (n: number) =>
    [n - 2, n - 1, n + 1, n + 2, n + 3, n - 3].filter((x) => x >= 1 && x <= 10 && x !== n).map((x) => ({ zh: NUMS[x - 1], en: String(x) }));
  const COUNT_ICONS = ["apple", "star", "balloon", "fish", "flower", "ball", "cat", "car", "banana", "bird"];
  const countQ = ["數一數，一共有幾多？", "圖入面有幾多？", "一齊數一數，有幾多？"];
  for (let n = 1; n <= 10; n++) {
    b.add({
      topic: "words", d: n <= 5 ? 1 : 2,
      qz: countQ[n % 3], qe: "Count them. How many are there?",
      img: "count", cfg: { name: COUNT_ICONS[n - 1], count: n },
      right: c(NUMS[n - 1], String(n)),
      wrong: pick(near(n), [], 3, b.n).map((x) => c(x.zh, x.en)),
      ez: `一共有${NUMS[n - 1]}個。`, ee: `There are ${n} in total.`,
      tags: ["數字", NUMS[n - 1]],
    });
  }
  const T2N = [2, 4, 6, 7, 9, 10];
  const T2I = ["star", "apple", "balloon", "fish", "flower", "ball"];
  T2N.forEach((n, i) =>
    b.add({
      topic: "words", d: 2,
      qz: `邊一組有「${NUMS[n - 1]}」個？`, qe: `Which group has ${n}?`,
      style: "icon",
      right: c(NUMS[n - 1], String(n), { icon: T2I[i], count: n }),
      wrong: pick(near(n), [], 3, b.n).map((x) => c(x.zh, x.en, { icon: T2I[i], count: Number(x.en) })),
      ez: `「${NUMS[n - 1]}」就係 ${n} 個。`, ee: `"${NUMS[n - 1]}" means ${n}.`,
      tags: ["數字", NUMS[n - 1]],
    }),
  );

  // 家庭稱謂
  const FCLUE: Record<string, [string, string]> = {
    爸爸: ["屋企嘅大人，係男人。佢係我嘅…？", "A grown-up man in my family. He is my…?"],
    媽媽: ["屋企嘅大人，係女人。佢係我嘅…？", "A grown-up woman in my family. She is my…?"],
    哥哥: ["比我大嘅男仔，係我嘅…？", "A boy who is older than me is my…?"],
    姐姐: ["比我大嘅女仔，係我嘅…？", "A girl who is older than me is my…?"],
    弟弟: ["比我細嘅男仔，係我嘅…？", "A boy who is younger than me is my…?"],
    妹妹: ["比我細嘅女仔，係我嘅…？", "A girl who is younger than me is my…?"],
  };
  FAMILY.forEach((f) =>
    b.add({
      topic: "words", d: 1,
      qz: FCLUE[f.zh][0], qe: FCLUE[f.zh][1],
      img: "icon", cfg: { name: f.icon, size: 130 },
      right: ch(f, false), wrong: pick(FAMILY, [f.zh], 3, b.n).map((x) => ch(x, false)),
      ez: `佢係我嘅${f.zh}。`, ee: `This person is my ${f.en}.`,
      tags: ["家庭稱謂", f.zh],
    }),
  );

  // 動物（線索）
  const ACLUE: Record<string, [string, string]> = {
    貓: ["邊隻動物「喵喵」叫？", 'Which animal says "meow"?'],
    狗: ["邊隻動物「汪汪」叫？", 'Which animal says "woof"?'],
    鳥: ["邊隻動物有翅膀，識喺天空飛？", "Which animal has wings and flies in the sky?"],
    魚: ["邊隻動物住喺水入面？", "Which animal lives in the water?"],
    兔: ["邊隻動物有長長嘅耳仔，識跳？", "Which animal has long ears and hops?"],
    象: ["邊隻動物有長長嘅鼻？", "Which animal has a long trunk?"],
    獅: ["邊隻動物係森林之王，有鬃毛？", "Which animal is the king of the forest and has a mane?"],
    猴: ["邊隻動物最愛食香蕉，識爬樹？", "Which animal loves bananas and climbs trees?"],
  };
  ANIMALS.forEach((a) =>
    b.add({
      topic: "words", d: 1,
      qz: ACLUE[a.zh][0], qe: ACLUE[a.zh][1],
      right: ch(a), wrong: pick(ANIMALS, [a.zh], 3, b.n).map((x) => ch(x)),
      ez: `答案係「${a.zh}」。`, ee: `The answer is "${a.zh}" (${a.en}).`,
      tags: ["動物", a.zh],
    }),
  );

  // 食物（線索）
  const FCL: Record<string, [string, string]> = {
    蘋果: ["邊樣紅色、圓圓、脆脆地？", "Which one is red, round and crunchy?"],
    香蕉: ["邊樣係黃色、彎彎嘅生果？", "Which is a yellow, curved fruit?"],
    橙: ["邊樣係橙色、圓圓、好多汁嘅生果？", "Which is an orange, round, juicy fruit?"],
    牛奶: ["邊樣係白色嘅飲品，小朋友要飲？", "Which is a white drink that children should have?"],
    麵包: ["邊樣用麵粉焗成，早餐成日食？", "Which is baked from flour and often eaten at breakfast?"],
    蛋: ["邊樣係雞生出嚟，可以煎嚟食？", "Which comes from a hen and can be fried?"],
    飯: ["邊樣用米煮成，要用碗盛？", "Which is cooked from rice and served in a bowl?"],
    水: ["邊樣透明、冇味道，口渴要飲？", "Which is clear, tasteless and what we drink when thirsty?"],
  };
  FOODS.forEach((f) =>
    b.add({
      topic: "words", d: 1,
      qz: FCL[f.zh][0], qe: FCL[f.zh][1],
      right: ch(f), wrong: pick(FOODS, [f.zh], 3, b.n).map((x) => ch(x)),
      ez: `答案係「${f.zh}」。`, ee: `The answer is "${f.zh}" (${f.en}).`,
      tags: ["食物", f.zh],
    }),
  );

  // 身體部位（線索）
  const BCL: Record<string, [string, string]> = {
    頭: ["戴帽仔嘅位置係邊度？", "Where do we wear a hat?"],
    眼: ["用嚟睇嘢嘅係咩？", "What do we use to see?"],
    耳: ["用嚟聽聲音嘅係咩？", "What do we use to hear?"],
    鼻: ["用嚟聞味道嘅係咩？", "What do we use to smell?"],
    口: ["用嚟食嘢同講嘢嘅係咩？", "What do we use to eat and talk?"],
    手: ["用嚟拿東西同拍掌嘅係咩？", "What do we use to hold things and clap?"],
    腳: ["用嚟行路同跑步嘅係咩？", "What do we use to walk and run?"],
  };
  BODY.forEach((p) =>
    b.add({
      topic: "words", d: 1,
      qz: BCL[p.zh][0], qe: BCL[p.zh][1],
      right: ch(p), wrong: pick(BODY, [p.zh], 3, b.n).map((x) => ch(x)),
      ez: `答案係「${p.zh}」。`, ee: `The answer is "${p.zh}" (${p.en}).`,
      tags: ["身體部位", p.zh],
    }),
  );

  // 天氣
  WEATHER.forEach((w) =>
    b.add({
      topic: "words", d: 1,
      qz: "今日天氣點樣？", qe: "What is the weather like today?",
      img: "icon", cfg: { name: w.icon, size: 130 },
      right: ch(w, false), wrong: WEATHER.filter((x) => x.zh !== w.zh).map((x) => ch(x, false)),
      ez: `呢個係「${w.zh}」。`, ee: `This is a ${w.en}.`,
      tags: ["天氣", w.zh],
    }),
  );
  const WCL: Record<string, [string, string]> = {
    晴天: ["太陽好光猛，可以曬太陽。係咩天氣？", "The sun is bright and warm. What is the weather?"],
    雨天: ["出街要帶遮。係咩天氣？", "We need an umbrella outside. What is the weather?"],
    大風: ["風吹得好大，樹葉飛起上嚟。係咩天氣？", "The wind is strong and leaves fly up. What is the weather?"],
    多雲: ["天空有好多白色嘅雲。係咩天氣？", "The sky has lots of white clouds. What is the weather?"],
  };
  WEATHER.forEach((w) =>
    b.add({
      topic: "words", d: 1,
      qz: WCL[w.zh][0], qe: WCL[w.zh][1],
      right: ch(w), wrong: WEATHER.filter((x) => x.zh !== w.zh).map((x) => ch(x)),
      ez: `答案係「${w.zh}」。`, ee: `The answer is "${w.zh}" (${w.en}).`,
      tags: ["天氣", w.zh],
    }),
  );

  // 避免 RADICALS 未使用警告（其他檔案共用）
  void RADICALS;
}
