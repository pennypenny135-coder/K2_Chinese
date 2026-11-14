import { Bank, c, pick } from "./helpers";
import { COLORS, ch, colorChoice } from "./vocab";
import type { Word } from "./vocab";
import { addStory, it } from "./k2More";
import type { Choice } from "./types";

// 物件名稱（中英）
const ICN: Record<string, [string, string]> = {
  apple: ["蘋果", "apple"], banana: ["香蕉", "banana"], orange: ["橙", "orange"], grape: ["提子", "grapes"], watermelon: ["西瓜", "watermelon"],
  car: ["汽車", "car"], cat: ["貓", "cat"], dog: ["狗", "dog"], book: ["書", "book"], ball: ["皮球", "ball"], shirt: ["衫", "shirt"],
  hat: ["帽", "hat"], dress: ["裙", "dress"], bird: ["鳥", "bird"], butterfly: ["蝴蝶", "butterfly"], plane: ["飛機", "aeroplane"],
  fish: ["魚", "fish"], rabbit: ["兔", "rabbit"], elephant: ["大象", "elephant"], cow: ["牛", "cow"], pig: ["豬", "pig"],
  boat: ["船", "boat"], bus: ["巴士", "bus"], train: ["火車", "train"], bed: ["床", "bed"], table: ["枱", "table"],
  pencil: ["鉛筆", "pencil"], ruler: ["尺", "ruler"], flower: ["花", "flower"], tree: ["樹", "tree"], house: ["屋", "house"],
  bag: ["書包", "school bag"], milk: ["牛奶", "milk"], water: ["水", "water"], rice: ["飯", "rice"], egg: ["蛋", "egg"],
  bread: ["麵包", "bread"], cake: ["蛋糕", "cake"], blocks: ["積木", "blocks"], balloon: ["氣球", "balloon"], shoes: ["鞋", "shoes"],
  socks: ["襪", "socks"], gloves: ["手套", "gloves"], paper: ["紙", "paper"], towel: ["毛巾", "towel"], road: ["馬路", "road"],
  school: ["學校", "school"], sun: ["太陽", "sun"], moon: ["月亮", "moon"], star: ["星星", "star"], stationery: ["文具", "stationery"],
  teacher: ["老師", "teacher"], friends: ["朋友", "friends"], umbrella: ["遮", "umbrella"], mountain: ["山", "mountain"],
};
const obj = (icon: string, color?: string): Choice => c(ICN[icon][0], ICN[icon][1], { icon, iconColor: color });

export function addK3More(b: Bank) {
  // ================= 量詞 =================
  const MW = [
    { zh: "雙", en: "for pairs" },
    { zh: "張", en: "for flat things, tables and beds" },
    { zh: "輛", en: "for vehicles" },
    { zh: "間", en: "for houses, rooms and shops" },
    { zh: "頭", en: "for big animals" },
    { zh: "條", en: "for long things" },
  ];
  const mw = (zh: string) => c(zh, MW.find((m) => m.zh === zh)!.en);
  interface Item { mw: string; name: string; en: string; icon: string; color?: string }
  const ITEMS: Item[] = [
    { mw: "雙", name: "鞋", en: "shoes", icon: "shoes" },
    { mw: "雙", name: "襪", en: "socks", icon: "socks" },
    { mw: "雙", name: "手套", en: "gloves", icon: "gloves" },
    { mw: "張", name: "枱", en: "table", icon: "table" },
    { mw: "張", name: "床", en: "bed", icon: "bed" },
    { mw: "張", name: "紙", en: "paper", icon: "paper" },
    { mw: "輛", name: "汽車", en: "car", icon: "car" },
    { mw: "輛", name: "巴士", en: "bus", icon: "bus" },
    { mw: "輛", name: "單車", en: "bicycle", icon: "bike" },
    { mw: "間", name: "屋", en: "house", icon: "house" },
    { mw: "間", name: "學校", en: "school", icon: "school" },
    { mw: "間", name: "藍色嘅屋", en: "blue house", icon: "house", color: "#60a5fa" },
    { mw: "頭", name: "牛", en: "cow", icon: "cow" },
    { mw: "頭", name: "豬", en: "pig", icon: "pig" },
    { mw: "頭", name: "大象", en: "elephant", icon: "elephant" },
    { mw: "條", name: "魚", en: "fish", icon: "fish" },
    { mw: "條", name: "馬路", en: "road", icon: "road" },
    { mw: "條", name: "毛巾", en: "towel", icon: "towel" },
  ];
  ITEMS.forEach((x) =>
    b.add({
      topic: "measure", d: 2,
      qz: `一（　）${x.name}`, qe: `Pick the right measure word: one ___ ${x.en}`,
      audio: `一，${x.name}。要用邊個量詞？`,
      img: "icon", cfg: { name: x.icon, color: x.color, size: 120 },
      right: mw(x.mw), wrong: pick(MW.filter((m) => m.zh !== x.mw), [], 3, b.n).map((m) => mw(m.zh)),
      ez: `「一${x.mw}${x.name}」：「${x.mw}」${MW.find((m) => m.zh === x.mw)!.en}。`,
      ee: `We say "一${x.mw}${x.name}". "${x.mw}" is used ${MW.find((m) => m.zh === x.mw)!.en}.`,
      tags: ["量詞", x.mw],
    }),
  );
  [1, 4, 7, 10, 13, 16].forEach((idx) => {
    const r = ITEMS[idx];
    const others = ITEMS.filter((x) => x.mw !== r.mw);
    b.add({
      topic: "measure", d: 3,
      qz: `邊個可以用「一${r.mw}」嚟數？`, qe: `Which one can be counted with "一${r.mw}"?`,
      style: "icon",
      right: c(r.name, r.en, { icon: r.icon, iconColor: r.color }),
      wrong: pick(others.map((o) => ({ zh: o.name, en: o.en, icon: o.icon, color: o.color })), [], 3, b.n).map((o) => c(o.zh, o.en, { icon: o.icon, iconColor: o.color })),
      ez: `「${r.mw}」${MW.find((m) => m.zh === r.mw)!.en}，所以係「一${r.mw}${r.name}」。`,
      ee: `"${r.mw}" is used ${MW.find((m) => m.zh === r.mw)!.en}.`,
      tags: ["量詞", r.mw],
    });
  });

  // ================= 句子 =================
  interface SQ { qz: string; qe: string; right: Choice; wrong: Choice[]; ez: string; ee: string; style?: "text" | "icon" | "color" | "swatch" }
  const addSen = (zh: string, en: string, img: "icon" | "scene" | "count" | "position", cfg: Record<string, unknown>, qs: SQ[], tag: string) =>
    qs.forEach((q) =>
      b.add({
        topic: "sentences", d: 2,
        qz: `「${zh}」\n${q.qz}`, qe: `"${en}"\n${q.qe}`,
        audio: `${zh}${q.qz}`,
        img, cfg, style: q.style,
        right: q.right, wrong: q.wrong, ez: q.ez, ee: q.ee,
        tags: ["句子理解", tag],
      }),
    );
  const T4 = [c("早上", "morning"), c("中午", "noon"), c("下午", "afternoon"), c("晚上", "evening")];
  addSen("小明每天早上返學。", "Siu Ming goes to school every morning.", "scene",
    { bg: "park", items: [it("sun", 230, 4, 50), it("kid", 30, 50, 80), it("school", 150, 36, 90)] }, [
      { qz: "小明幾時返學？", qe: "When does Siu Ming go to school?", right: T4[0], wrong: [T4[1], T4[2], T4[3]], ez: "句子話「每天早上」。", ee: 'The sentence says "every morning".' },
      { qz: "小明去邊度？", qe: "Where does Siu Ming go?", style: "icon", right: obj("school"), wrong: [obj("house"), obj("tree"), obj("mountain")], ez: "小明返學，即係去學校。", ee: "Siu Ming goes to school." },
    ], "返學");
  const NUMC = [c("兩個", "two"), c("三個", "three"), c("四個", "four"), c("五個", "five")];
  addSen("媽媽買咗三個蘋果。", "Mum bought three apples.", "count", { name: "apple", count: 3 }, [
    { qz: "媽媽買咗幾多個蘋果？", qe: "How many apples did Mum buy?", right: NUMC[1], wrong: [NUMC[0], NUMC[2], NUMC[3]], ez: "媽媽買咗三個蘋果。", ee: "Mum bought three apples." },
    { qz: "媽媽買咗咩？", qe: "What did Mum buy?", style: "icon", right: obj("apple"), wrong: [obj("banana"), obj("orange"), obj("grape")], ez: "媽媽買咗蘋果。", ee: "Mum bought apples." },
  ], "數量");
  const POSC = [c("枱下面", "under the table"), c("枱上面", "on the table"), c("枱左邊", "left of the table"), c("枱右邊", "right of the table")];
  addSen("小貓喺枱下面。", "The kitten is under the table.", "position", { rel: "under", obj: "cat", ref: "table" }, [
    { qz: "小貓喺邊度？", qe: "Where is the kitten?", right: POSC[0], wrong: [POSC[1], POSC[2], POSC[3]], ez: "小貓喺枱下面。", ee: "The kitten is under the table." },
  ], "方位");
  addSen("哥哥喺公園踢波。", "Older brother plays football in the park.", "scene",
    { bg: "park", items: [it("brother", 40, 40, 90), it("ball", 160, 80, 40), it("tree", 220, 30, 80)] }, [
      { qz: "邊個踢波？", qe: "Who is playing football?", right: c("哥哥", "older brother"), wrong: [c("姐姐", "older sister"), c("弟弟", "younger brother"), c("妹妹", "younger sister")], ez: "哥哥踢波。", ee: "Older brother plays football." },
      { qz: "哥哥喺邊度踢波？", qe: "Where does he play?", style: "icon", right: c("公園", "park", { icon: "tree" }), wrong: [obj("school"), obj("house"), c("海邊", "beach", { icon: "boat" })], ez: "哥哥喺公園踢波。", ee: "He plays in the park." },
    ], "遊戲");
  addSen("姐姐用蠟筆畫畫。", "Older sister draws with crayons.", "icon", { name: "pencil", color: "#f97316", size: 110 }, [
    { qz: "姐姐用咩畫畫？", qe: "What does she draw with?", style: "icon", right: c("蠟筆", "crayon", { icon: "pencil", iconColor: "#f97316" }), wrong: [obj("towel"), obj("ball"), obj("bread")], ez: "姐姐用蠟筆畫畫。", ee: "She draws with crayons." },
  ], "文具");
  const WK = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
  const WKE = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  addSen("爸爸星期日帶我去公園。", "Dad takes me to the park on Sunday.", "scene",
    { bg: "park", items: [it("dad", 30, 40, 90), it("kid", 120, 56, 70), it("sun", 230, 4, 50)] }, [
      { qz: "爸爸星期幾帶我去公園？", qe: "On which day does Dad take me to the park?", right: c(WK[6], WKE[6]), wrong: [c(WK[0], WKE[0]), c(WK[2], WKE[2]), c(WK[4], WKE[4])], ez: "句子話「星期日」。", ee: 'The sentence says "Sunday".' },
    ], "星期");
  addSen("小鳥喺樹上唱歌。", "The little bird sings on the tree.", "scene",
    { bg: "park", items: [it("tree", 90, 14, 120), it("bird", 140, 24, 44)] }, [
      { qz: "小鳥做緊咩？", qe: "What is the bird doing?", right: c("唱歌", "singing"), wrong: [c("瞓覺", "sleeping"), c("游水", "swimming"), c("踢波", "playing football")], ez: "小鳥喺樹上唱歌。", ee: "The bird is singing on the tree." },
    ], "動物");
  addSen("今日落雨，我帶遮去學校。", "It rains today, so I take an umbrella to school.", "scene",
    { bg: "rain", items: [it("rain", 90, 0, 100), it("kid", 40, 56, 80), it("umbrella", 120, 58, 60)] }, [
      { qz: "今日天氣點？", qe: "What is the weather today?", style: "icon", right: c("雨天", "rainy", { icon: "rain" }), wrong: [c("晴天", "sunny", { icon: "sun" }), c("大風", "windy", { icon: "wind" }), c("多雲", "cloudy", { icon: "cloud" })], ez: "落雨即係雨天。", ee: "Rain means a rainy day." },
      { qz: "我帶咗咩去學校？", qe: "What did I take to school?", style: "icon", right: obj("umbrella"), wrong: [obj("hat"), obj("ball"), obj("bread")], ez: "我帶遮去學校。", ee: "I took an umbrella to school." },
    ], "天氣");
  addSen("弟弟飲咗一杯牛奶。", "Younger brother drank a glass of milk.", "icon", { name: "milk", size: 110 }, [
    { qz: "弟弟飲咗咩？", qe: "What did he drink?", style: "icon", right: obj("milk"), wrong: [obj("bread"), obj("egg"), obj("rice")], ez: "弟弟飲咗牛奶。", ee: "He drank milk." },
    { qz: "弟弟飲咗幾多杯牛奶？", qe: "How many glasses did he drink?", right: c("一杯", "one glass"), wrong: [c("兩杯", "two glasses"), c("三杯", "three glasses"), c("四杯", "four glasses")], ez: "句子話「一杯」。", ee: 'The sentence says "one glass".' },
  ], "飲食");

  // 標點
  const PUN = {
    stop: c("。句號", "full stop"),
    ask: c("？問號", "question mark"),
    wow: c("！感嘆號", "exclamation mark"),
    comma: c("，逗號", "comma"),
  };
  const PQ: [string, "stop" | "ask" | "comma", string][] = [
    ["我喜歡食蘋果", "stop", "I like eating apples"],
    ["你叫咩名", "ask", "What is your name"],
    ["媽媽喺廚房煮飯", "stop", "Mum is cooking in the kitchen"],
    ["你今年幾歲", "ask", "How old are you"],
    ["洗手間喺邊度", "ask", "Where is the toilet"],
    ["我有一隻小貓", "stop", "I have a kitten"],
    ["你喜歡食咩水果", "ask", "What fruit do you like"],
    ["我哋先去公園（　）再去食雪糕", "comma", "We go to the park first, then have ice cream"],
  ];
  PQ.forEach(([s, k, en]) => {
    const comma = k === "comma";
    b.add({
      topic: "sentences", d: 2,
      qz: comma ? `${s}。` : `${s}（　）`,
      qe: `Which punctuation mark fits? "${en}"`,
      audio: comma ? `${s.replace("（　）", "，")}。要用咩標點符號？` : `${s}。要用咩標點符號？`,
      right: PUN[k], wrong: (Object.keys(PUN) as (keyof typeof PUN)[]).filter((x) => x !== k).map((x) => PUN[x]),
      ez: k === "stop" ? "說明一件事，句尾用句號「。」。" : k === "ask" ? "發問嘅句子，句尾用問號「？」。" : "句中停頓一下，用逗號「，」。",
      ee: k === "stop" ? "A statement ends with a full stop." : k === "ask" ? "A question ends with a question mark." : "A comma marks a short pause inside a sentence.",
      tags: ["標點符號", PUN[k].zh.slice(1)],
    });
  });
  const COMPL = [
    { right: "小貓喺枱下面。", en: "The kitten is under the table.", wrong: ["小貓喺", "枱下面嘅", "下面枱喺小貓"] },
    { right: "媽媽買咗三個蘋果。", en: "Mum bought three apples.", wrong: ["媽媽買咗", "三個蘋果嘅", "蘋果買咗三媽媽"] },
    { right: "小明每天返學。", en: "Siu Ming goes to school every day.", wrong: ["小明每天", "返學嘅小", "每天小明返"] },
    { right: "哥哥踢波。", en: "Older brother kicks a ball.", wrong: ["哥哥踢", "踢波嘅", "波踢哥哥"] },
    { right: "我哋一齊去公園玩。", en: "We go to the park together.", wrong: ["我哋一齊去", "去公園玩嘅", "公園玩去一齊我哋"] },
    { right: "爸爸喺屋企煮飯。", en: "Dad is cooking at home.", wrong: ["爸爸喺", "煮飯嘅爸爸", "屋企煮飯爸爸喺"] },
  ];
  COMPL.forEach((x) =>
    b.add({
      topic: "sentences", d: 3,
      qz: "邊個係完整嘅句子？", qe: "Which one is a complete sentence?",
      right: c(x.right, x.en),
      wrong: [c(x.wrong[0], "incomplete sentence"), c(x.wrong[1], "incomplete sentence"), c(x.wrong[2], "words in the wrong order")],
      ez: "完整句子有「誰」同「做咩」，並用句號完結。", ee: "A complete sentence says who and what, and ends with a full stop.",
      tags: ["完整句子"],
    }),
  );

  // ================= 聆聽 =================
  const LW: Word[] = ["sun", "moon", "star", "school", "book", "stationery", "teacher", "friends"].map((i) => ({ zh: ICN[i][0] === "書" ? "圖書" : ICN[i][0], en: ICN[i][1], icon: i }));
  [0, 1, 2, 3, 4, 5].forEach((i) => {
    const w = LW[i];
    b.add({
      topic: "listening", d: 2,
      qz: ["聽一聽，邊幅圖係你聽到嘅？", "留心聽，你聽到邊個詞語？"][i % 2], qe: "Listen. Which picture matches the word you heard?",
      audio: w.zh, style: "icon",
      right: ch(w), wrong: pick(LW, [w.zh], 3, b.n).map((x) => ch(x)),
      ez: `你聽到嘅係「${w.zh}」。`, ee: `You heard "${w.zh}" (${w.en}).`,
      tags: ["聆聽", "詞語", w.zh],
    });
  });
  const LP: { s: string; en: string; n: string; nEn: string; p: string; pEn: string; picks: [string, string][] }[] = [
    { s: "小貓喺枱上面。", en: "The kitten is on the table.", n: "枱", nEn: "table", p: "上面", pEn: "on top of", picks: [["上面", "on top of"], ["下面", "under"], ["裡面", "inside"], ["外面", "outside"]] },
    { s: "小鳥喺樹上面。", en: "The bird is above the tree.", n: "樹", nEn: "tree", p: "上面", pEn: "above", picks: [["上面", "above"], ["下面", "below"], ["左邊", "left of"], ["右邊", "right of"]] },
    { s: "小兔喺箱裡面。", en: "The rabbit is inside the box.", n: "箱", nEn: "box", p: "裡面", pEn: "inside", picks: [["裡面", "inside"], ["外面", "outside"], ["上面", "on top of"], ["下面", "under"]] },
    { s: "小狗喺屋外面。", en: "The puppy is outside the house.", n: "屋", nEn: "house", p: "外面", pEn: "outside", picks: [["外面", "outside"], ["裡面", "inside"], ["上面", "on top of"], ["後面", "behind"]] },
    { s: "皮球喺椅下面。", en: "The ball is under the chair.", n: "椅", nEn: "chair", p: "下面", pEn: "under", picks: [["下面", "under"], ["上面", "on top of"], ["前面", "in front of"], ["後面", "behind"]] },
    { s: "小貓喺小狗後面。", en: "The kitten is behind the puppy.", n: "小狗", nEn: "puppy", p: "後面", pEn: "behind", picks: [["後面", "behind"], ["前面", "in front of"], ["左邊", "left of"], ["右邊", "right of"]] },
  ];
  LP.forEach((x) => {
    const mk = (z: string, e: string) => c(`${x.n}${z}`, `${e} the ${x.nEn}`);
    b.add({
      topic: "listening", d: 3,
      qz: "聽一聽，位置喺邊度？", qe: "Listen. Where is it?",
      audio: x.s,
      right: mk(x.p, x.pEn),
      wrong: x.picks.filter((p) => p[0] !== x.p).map((p) => mk(p[0], p[1])),
      ez: x.s, ee: x.en,
      tags: ["聆聽", "方位"],
    });
  });
  const LC: { audio: string; qz: string; qe: string; right: Choice; wrong: Choice[]; style?: "icon" | "color"; ez: string; ee: string }[] = [
    { audio: "今日係星期三。明天係星期幾？", qz: "聽一聽，明天係星期幾？", qe: "Listen. What day is tomorrow?", right: c("星期四", "Thursday"), wrong: [c("星期二", "Tuesday"), c("星期五", "Friday"), c("星期日", "Sunday")], ez: "星期三之後係星期四。", ee: "Thursday follows Wednesday." },
    { audio: "小明喺學校畫畫，佢畫咗一個太陽。小明畫咗咩？", qz: "聽一聽，小明畫咗咩？", qe: "Listen. What did Siu Ming draw?", style: "icon", right: obj("sun"), wrong: [obj("moon"), obj("star"), obj("flower")], ez: "小明畫咗一個太陽。", ee: "Siu Ming drew a sun." },
    { audio: "媽媽喺街市買咗兩條魚。媽媽買咗幾多條魚？", qz: "聽一聽，媽媽買咗幾多條魚？", qe: "Listen. How many fish did Mum buy?", style: "icon", right: c("兩條", "2", { icon: "fish", count: 2 }), wrong: [c("三條", "3", { icon: "fish", count: 3 }), c("四條", "4", { icon: "fish", count: 4 }), c("一條", "1", { icon: "fish", count: 1 })], ez: "媽媽買咗兩條魚。", ee: "Mum bought two fish." },
    { audio: "姐姐著咗藍色嘅裙。姐姐著咩顏色嘅裙？", qz: "聽一聽，裙係咩顏色？", qe: "Listen. What colour is the dress?", style: "color", right: colorChoice(COLORS[2]), wrong: [COLORS[0], COLORS[1], COLORS[3]].map(colorChoice), ez: "姐姐著藍色嘅裙。", ee: "Older sister wears a blue dress." },
    { audio: "小狗喺花園玩，牠見到一隻蝴蝶。小狗見到咩？", qz: "聽一聽，小狗見到咩？", qe: "Listen. What did the puppy see?", style: "icon", right: obj("butterfly"), wrong: [obj("bird"), obj("fish"), obj("rabbit")], ez: "小狗見到一隻蝴蝶。", ee: "The puppy saw a butterfly." },
    { audio: "爸爸今日坐巴士去返工。爸爸坐咩去返工？", qz: "聽一聽，爸爸坐咩去返工？", qe: "Listen. How does Dad go to work?", style: "icon", right: obj("bus"), wrong: [obj("train"), obj("boat"), obj("plane")], ez: "爸爸坐巴士去返工。", ee: "Dad takes the bus to work." },
  ];
  LC.forEach((x) =>
    b.add({
      topic: "listening", d: 3, qz: x.qz, qe: x.qe, audio: x.audio, style: x.style,
      right: x.right, wrong: x.wrong, ez: x.ez, ee: x.ee, tags: ["聆聽", "理解"],
    }),
  );

  // ================= 故事 =================
  const FEEL = (z: string, e: string) => c(z, e);
  addStory(b, "park", [it("sun", 236, 2, 46), it("kid", 20, 52, 74), it("lilsis", 80, 66, 60), it("butterfly", 190, 50, 44, "#facc15")],
    "今日係星期日，小明同妹妹去公園玩。佢哋見到一隻黃色嘅蝴蝶。妹妹好開心。", "Today is Sunday. Siu Ming and his little sister go to the park. They see a yellow butterfly. Little sister is very happy.", [
      { qz: "邊個去公園？", qe: "Who goes to the park?", right: c("小明同妹妹", "Siu Ming and his little sister"), wrong: [c("爸爸同媽媽", "Dad and Mum"), c("哥哥同姐姐", "older brother and sister"), c("老師同同學", "the teacher and classmates")], ez: "小明同妹妹去公園。", ee: "Siu Ming and his sister go to the park." },
      { qz: "佢哋見到咩？", qe: "What do they see?", right: c("黃色蝴蝶", "a yellow butterfly", { icon: "butterfly", iconColor: "#facc15" }), wrong: [c("紅色氣球", "a red balloon", { icon: "balloon" }), c("白色小兔", "a white rabbit", { icon: "rabbit" }), c("藍色小鳥", "a blue bird", { icon: "bird" })], ez: "佢哋見到黃色嘅蝴蝶。", ee: "They see a yellow butterfly." },
      { qz: "妹妹覺得點？", qe: "How does little sister feel?", right: FEEL("開心", "happy"), wrong: [FEEL("難過", "sad"), FEEL("肚餓", "hungry"), FEEL("好眼瞓", "sleepy")], ez: "妹妹好開心。", ee: "Little sister is very happy." },
    ], 2, "公園");
  addStory(b, "rain", [it("rain", 100, 0, 100), it("mom", 20, 40, 90), it("umbrella", 100, 56, 64), it("school", 200, 40, 90)],
    "今日落大雨。媽媽帶咗遮同雨衣。我哋一齊行去學校。", "It rains heavily today. Mum brings an umbrella and a raincoat. We walk to school together.", [
      { qz: "今日天氣點？", qe: "What is the weather today?", right: c("雨天", "rainy", { icon: "rain" }), wrong: [c("晴天", "sunny", { icon: "sun" }), c("大風", "windy", { icon: "wind" }), c("多雲", "cloudy", { icon: "cloud" })], ez: "今日落大雨。", ee: "It rains heavily today." },
      { qz: "媽媽帶咗咩？", qe: "What did Mum bring?", right: obj("umbrella"), wrong: [obj("hat"), obj("ball"), obj("bag")], ez: "媽媽帶咗遮。", ee: "Mum brought an umbrella." },
      { qz: "我哋行去邊度？", qe: "Where are we walking to?", right: obj("school"), wrong: [obj("house"), c("公園", "park", { icon: "tree" }), obj("mountain")], ez: "我哋行去學校。", ee: "We walk to school." },
    ], 2, "雨天");
  addStory(b, "park", [it("dog", 30, 62, 56), it("ball", 100, 90, 28), it("cat", 190, 62, 56), it("flower", 140, 70, 40)],
    "小狗嘅球跌咗入草叢。小貓幫手搵到球。小狗話：「多謝你！」", "The puppy's ball falls into the grass. The kitten helps find it. The puppy says, \"Thank you!\"", [
      { qz: "邊個幫手搵球？", qe: "Who helps find the ball?", right: obj("cat"), wrong: [obj("rabbit"), obj("bird"), obj("fish")], ez: "小貓幫手搵到球。", ee: "The kitten helps find the ball." },
      { qz: "小狗話咩？", qe: "What does the puppy say?", right: c("多謝你！", "Thank you!"), wrong: [c("對唔住！", "Sorry!"), c("再見！", "Goodbye!"), c("早晨！", "Good morning!")], ez: "有人幫手，小狗講「多謝你」。", ee: "The puppy thanks the kitten for helping." },
      { qz: "球跌咗去邊度？", qe: "Where did the ball fall?", right: c("草叢", "the grass"), wrong: [c("水入面", "into the water"), c("屋入面", "inside the house"), c("樹上", "up the tree")], ez: "球跌咗入草叢。", ee: "The ball fell into the grass." },
    ], 2, "友誼");
  addStory(b, "night", [it("moon", 200, 6, 70), it("star", 40, 16, 30), it("star", 130, 36, 24), it("bed", 30, 66, 80), it("lilbro", 120, 56, 70)],
    "晚上，月亮出嚟。弟弟刷牙後，跟住就瞓覺。", "At night the moon comes out. After brushing his teeth, little brother goes to sleep.", [
      { qz: "呢個故事喺一日入面嘅咩時候？", qe: "What time of day is this story?", right: c("晚上", "evening"), wrong: [c("早上", "morning"), c("中午", "noon"), c("下午", "afternoon")], ez: "有月亮出嚟，係晚上。", ee: "The moon is out, so it is night." },
      { qz: "弟弟刷牙後做咩？", qe: "What does little brother do after brushing his teeth?", right: c("瞓覺", "goes to sleep", { icon: "bed" }), wrong: [c("食早餐", "eats breakfast", { icon: "bread" }), c("返學", "goes to school", { icon: "school" }), c("踢波", "plays football", { icon: "ball" })], ez: "弟弟刷牙後就瞓覺。", ee: "He goes to sleep after brushing his teeth." },
      { qz: "夜晚天空有咩？", qe: "What is in the sky at night?", right: obj("moon"), wrong: [obj("sun"), c("雨", "rain", { icon: "rain" }), c("風", "wind", { icon: "wind" })], ez: "夜晚天空有月亮。", ee: "The moon is in the night sky." },
    ], 2, "夜晚");
  addStory(b, "park", [it("teacher", 20, 36, 96), it("kid", 130, 56, 70), it("kidgirl", 190, 56, 70), it("school", 230, 20, 60)],
    "喺學校，老師教我哋排隊。我哋慢慢行去飯堂食飯。", "At school the teacher teaches us to line up. We walk slowly to the canteen for lunch.", [
      { qz: "邊個教我哋排隊？", qe: "Who teaches us to line up?", right: c("老師", "the teacher", { icon: "teacher" }), wrong: [c("爸爸", "Dad", { icon: "dad" }), c("媽媽", "Mum", { icon: "mom" }), c("哥哥", "older brother", { icon: "brother" })], ez: "老師教我哋排隊。", ee: "The teacher teaches us to line up." },
      { qz: "排隊嗰陣要點行？", qe: "How should we walk in a line?", right: c("慢慢行", "walk slowly"), wrong: [c("跑得好快", "run very fast"), c("跳嚟跳去", "jump around"), c("大叫大嚷", "shout loudly")], ez: "排隊要慢慢行，先安全。", ee: "Walk slowly in line to stay safe." },
      { qz: "我哋去邊度食飯？", qe: "Where do we eat?", right: c("飯堂", "canteen"), wrong: [c("公園", "park"), c("操場", "playground"), c("圖書館", "library")], ez: "我哋行去飯堂食飯。", ee: "We go to the canteen to eat." },
    ], 2, "學校");
  addStory(b, "room", [it("sister", 20, 40, 90), it("cake", 130, 56, 64), it("dad", 200, 40, 90)],
    "今日係姐姐生日。爸爸買咗一個蛋糕。我哋一齊唱生日歌。", "Today is older sister's birthday. Dad bought a cake. We sing the birthday song together.", [
      { qz: "今日係邊個生日？", qe: "Whose birthday is it today?", right: c("姐姐", "older sister", { icon: "sister" }), wrong: [c("爸爸", "Dad", { icon: "dad" }), c("媽媽", "Mum", { icon: "mom" }), c("弟弟", "younger brother", { icon: "lilbro" })], ez: "今日係姐姐生日。", ee: "It is older sister's birthday." },
      { qz: "爸爸買咗咩？", qe: "What did Dad buy?", right: obj("cake"), wrong: [obj("bread"), obj("apple"), obj("milk")], ez: "爸爸買咗蛋糕。", ee: "Dad bought a cake." },
      { qz: "我哋一齊做咩？", qe: "What do we do together?", right: c("唱生日歌", "sing the birthday song"), wrong: [c("睇書", "read a book"), c("踢波", "play football"), c("游水", "swim")], ez: "我哋一齊唱生日歌。", ee: "We sing the birthday song together." },
    ], 2, "生日");

  // ================= 生活常識 =================
  const PH = {
    morning: c("早晨！", "Good morning!"),
    excuse: c("唔該！", "Excuse me / Please"),
    thanks: c("多謝！", "Thank you!"),
    sorry: c("對唔住！", "Sorry!"),
    eat: c("請慢慢食！", "Please enjoy your meal!"),
    queue: c("排隊等候", "Wait in line"),
    bye: c("再見！", "Goodbye!"),
    hello: c("你好！", "Hello!"),
  };
  const phAll = Object.values(PH);
  const SIT: { qz: string; qe: string; right: Choice; ex: string[]; ez: string; ee: string; icon: string; tag: string }[] = [
    { qz: "早上返到學校，見到同學。你會講咩？", qe: "You see a classmate at school in the morning. What do you say?", right: PH.morning, ex: ["你好！", "再見！"], ez: "早上見面，講「早晨」。", ee: "In the morning, say \"早晨\".", icon: "school", tag: "早晨" },
    { qz: "早上喺樓下遇到鄰居婆婆。你會講咩？", qe: "You meet an elderly neighbour downstairs in the morning. What do you say?", right: PH.morning, ex: ["你好！", "再見！"], ez: "有禮貌咁講「早晨」。", ee: "Greet politely with \"早晨\".", icon: "house", tag: "早晨" },
    { qz: "你想請前面嘅人讓一讓。你會講咩？", qe: "You want the person in front to make way. What do you say?", right: PH.excuse, ex: ["多謝！", "再見！"], ez: "請人讓路，講「唔該」。", ee: "To ask someone to make way, say \"唔該\".", icon: "road", tag: "唔該" },
    { qz: "叔叔幫你按電梯。你會講咩？", qe: "An uncle presses the lift button for you. What do you say?", right: PH.excuse, ex: ["多謝！", "對唔住！"], ez: "有人幫你，講「唔該」。", ee: "Say \"唔該\" when someone helps with a service.", icon: "dad", tag: "唔該" },
    { qz: "朋友送你一份禮物。你會講咩？", qe: "A friend gives you a present. What do you say?", right: PH.thanks, ex: ["唔該！", "早晨！"], ez: "收到禮物，講「多謝」。", ee: "When you get a gift, say \"多謝\".", icon: "cake", tag: "多謝" },
    { qz: "老師教你寫字。你會講咩？", qe: "The teacher teaches you to write. What do you say?", right: c("多謝老師！", "Thank you, teacher!"), ex: ["唔該！", "早晨！", "對唔住！"], ez: "多謝老師教我們。", ee: "Thank the teacher for teaching you.", icon: "teacher", tag: "多謝" },
    { qz: "你不小心撞到同學。你會講咩？", qe: "You bump into a classmate by accident. What do you say?", right: PH.sorry, ex: ["唔該！", "早晨！"], ez: "撞到人，要講「對唔住」。", ee: "If you bump someone, say \"對唔住\".", icon: "friends", tag: "對唔住" },
    { qz: "你返學遲到了，走入課室。你會講咩？", qe: "You are late for school and enter the classroom. What do you say?", right: c("對唔住，我遲到了。", "Sorry, I am late."), ex: ["早晨！", "再見！", "請慢慢食！"], ez: "遲到要講「對唔住」。", ee: "If you are late, say sorry.", icon: "school", tag: "對唔住" },
    { qz: "朋友來你家食飯，飯菜準備好了。你會講咩？", qe: "A friend comes to eat at your home and the food is ready. What do you say?", right: PH.eat, ex: ["再見！", "對唔住！", "早晨！"], ez: "請人食飯，講「請慢慢食」。", ee: "Invite guests with \"請慢慢食\".", icon: "rice", tag: "請慢慢食" },
    { qz: "媽媽將飯菜放喺枱上，你同家人講咩？", qe: "Mum puts the dishes on the table. What do you say to your family?", right: PH.eat, ex: ["早晨！", "對唔住！"], ez: "同家人一齊食飯，可以講「請慢慢食」。", ee: "You can say \"請慢慢食\" at the family table.", icon: "table", tag: "請慢慢食" },
    { qz: "買雪糕嘅人好多，應該點做？", qe: "Many people are buying ice cream. What should we do?", right: PH.queue, ex: ["跑去最前面", "喺旁邊玩"], ez: "好多人嘅時候，要排隊等候。", ee: "When there are many people, wait in line.", icon: "friends", tag: "排隊等候" },
    { qz: "搭巴士嗰陣，應該點做？", qe: "What should we do when taking the bus?", right: PH.queue, ex: ["跑去最前面", "喺旁邊玩"], ez: "上車前要排隊等候。", ee: "Line up and wait before boarding.", icon: "bus", tag: "排隊等候" },
  ];
  SIT.forEach((s) => {
    const extraPool = [
      ...phAll.filter((p) => !s.ex.includes(p.zh) && p.zh !== s.right.zh),
    ];
    const wrong: Choice[] = [];
    s.ex.forEach((e) => {
      const found = phAll.find((p) => p.zh === e);
      wrong.push(found ?? c(e, e === "跑去最前面" ? "Run to the front" : e === "喺旁邊玩" ? "Play on the side" : e));
    });
    // 補足 3 個干擾項
    while (wrong.length < 3) {
      const nxt = pick(extraPool, [...wrong.map((w) => w.zh), s.right.zh, "多謝！", "唔該！"], 1, b.n + wrong.length)[0];
      if (!nxt) break;
      wrong.push(nxt);
    }
    b.add({
      topic: "life", d: 2, qz: s.qz, qe: s.qe,
      img: "icon", cfg: { name: s.icon, size: 100 },
      right: s.right, wrong: wrong.slice(0, 3), ez: s.ez, ee: s.ee, tags: ["禮貌用語", s.tag],
    });
  });

  // 分類
  interface Cat { q: string; qe: string; right: string; wrong: string[]; ez: string; ee: string; tag: string; color?: string }
  const CATS: Cat[] = [
    { q: "邊個係水果？", qe: "Which one is a fruit?", right: "apple", wrong: ["car", "cat", "book"], ez: "蘋果係水果。", ee: "An apple is a fruit.", tag: "水果" },
    { q: "邊個係水果？", qe: "Which one is a fruit?", right: "banana", wrong: ["ball", "shirt", "bus"], ez: "香蕉係水果。", ee: "A banana is a fruit.", tag: "水果" },
    { q: "邊個係水果？", qe: "Which one is a fruit?", right: "grape", wrong: ["table", "hat", "fish"], ez: "提子係水果。", ee: "Grapes are fruit.", tag: "水果" },
    { q: "邊個識飛？", qe: "Which one can fly?", right: "bird", wrong: ["cat", "fish", "cow"], ez: "鳥有翅膀，識飛。", ee: "Birds have wings and can fly.", tag: "識飛" },
    { q: "邊個識飛？", qe: "Which one can fly?", right: "butterfly", wrong: ["rabbit", "elephant", "pig"], ez: "蝴蝶識飛。", ee: "Butterflies can fly.", tag: "識飛" },
    { q: "邊個識飛？", qe: "Which one can fly?", right: "plane", wrong: ["car", "boat", "train"], ez: "飛機識喺天空飛。", ee: "Aeroplanes fly in the sky.", tag: "識飛" },
    { q: "邊個係交通工具？", qe: "Which one is a vehicle?", right: "car", wrong: ["apple", "cat", "book"], ez: "汽車係交通工具。", ee: "A car is a vehicle.", tag: "交通工具" },
    { q: "邊個係交通工具？", qe: "Which one is a vehicle?", right: "bus", wrong: ["flower", "fish", "shirt"], ez: "巴士係交通工具。", ee: "A bus is a vehicle.", tag: "交通工具" },
    { q: "邊個係交通工具？", qe: "Which one is a vehicle?", right: "train", wrong: ["bag", "cow", "sun"], ez: "火車係交通工具。", ee: "A train is a vehicle.", tag: "交通工具" },
    { q: "邊個係動物？", qe: "Which one is an animal?", right: "cat", wrong: ["apple", "car", "tree"], ez: "貓係動物。", ee: "A cat is an animal.", tag: "動物" },
    { q: "邊個係動物？", qe: "Which one is an animal?", right: "cow", wrong: ["bed", "book", "hat"], ez: "牛係動物。", ee: "A cow is an animal.", tag: "動物" },
    { q: "邊個係文具？", qe: "Which one is stationery?", right: "pencil", wrong: ["ball", "apple", "cat"], ez: "鉛筆係文具。", ee: "A pencil is stationery.", tag: "文具" },
    { q: "邊個係文具？", qe: "Which one is stationery?", right: "ruler", wrong: ["shirt", "fish", "car"], ez: "尺係文具。", ee: "A ruler is stationery.", tag: "文具" },
    { q: "邊個係衣服？", qe: "Which one is clothing?", right: "shirt", wrong: ["apple", "ball", "pencil"], ez: "衫係衣服。", ee: "A shirt is clothing.", tag: "衣服" },
    { q: "邊個係衣服？", qe: "Which one is clothing?", right: "dress", wrong: ["table", "cat", "tree"], ez: "裙係衣服。", ee: "A dress is clothing.", tag: "衣服" },
    { q: "邊個可以飲？", qe: "Which one can we drink?", right: "milk", wrong: ["rice", "apple", "egg"], ez: "牛奶可以飲。", ee: "We can drink milk.", tag: "飲品" },
    { q: "邊個可以飲？", qe: "Which one can we drink?", right: "water", wrong: ["bread", "banana", "cake"], ez: "水可以飲。", ee: "We can drink water.", tag: "飲品" },
    { q: "邊個係玩具？", qe: "Which one is a toy?", right: "ball", wrong: ["shirt", "apple", "pencil"], ez: "皮球係玩具。", ee: "A ball is a toy.", tag: "玩具" },
    { q: "邊個係玩具？", qe: "Which one is a toy?", right: "blocks", wrong: ["shoes", "bag", "fish"], ez: "積木係玩具。", ee: "Building blocks are toys.", tag: "玩具" },
  ];
  CATS.forEach((x) =>
    b.add({
      topic: "life", d: 1, qz: x.q, qe: x.qe, style: "icon",
      right: obj(x.right), wrong: x.wrong.map((w) => obj(w)),
      ez: x.ez, ee: x.ee, tags: ["分類", x.tag],
    }),
  );
  const ODD: { right: string; others: string[]; ez: string; ee: string }[] = [
    { right: "car", others: ["apple", "banana", "orange"], ez: "蘋果、香蕉、橙都係水果，汽車唔係。", ee: "Apple, banana and orange are fruit. The car is not." },
    { right: "apple", others: ["cat", "dog", "rabbit"], ez: "貓、狗、兔都係動物，蘋果唔係。", ee: "Cat, dog and rabbit are animals. The apple is not." },
    { right: "cat", others: ["car", "bus", "train"], ez: "汽車、巴士、火車都係交通工具，貓唔係。", ee: "Car, bus and train are vehicles. The cat is not." },
    { right: "ball", others: ["shirt", "hat", "dress"], ez: "衫、帽、裙都係衣服，皮球唔係。", ee: "Shirt, hat and dress are clothes. The ball is not." },
  ];
  ODD.forEach((o) => {
    // 四個選項：3 個同類 + 1 個唔同類（答案）
    const choices = o.others.map((i) => obj(i));
    b.add({
      topic: "life", d: 3,
      qz: "邊個唔屬於同一類？", qe: "Which one does not belong with the others?",
      style: "icon",
      right: obj(o.right), wrong: choices,
      ez: o.ez, ee: o.ee, tags: ["分類", "找不同"],
    });
  });
}
