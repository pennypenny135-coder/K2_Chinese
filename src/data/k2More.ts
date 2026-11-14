import { Bank, c, pick, type Spec } from "./helpers";
import { ANIMALS, BODY, COLORS, FAMILY, FOODS, NUMS, ch, colorChoice } from "./vocab";
import type { Choice } from "./types";

export interface SceneItem {
  icon: string;
  x: number;
  y: number;
  s: number;
  color?: string;
}
export const it = (icon: string, x: number, y: number, s: number, color?: string): SceneItem => ({ icon, x, y, s, color });

export interface StoryQ {
  qz: string;
  qe: string;
  right: Choice;
  wrong: Choice[];
  ez: string;
  ee: string;
  style?: Spec["style"];
}
/** 加入一段短故事 + 若干條理解題 */
export function addStory(b: Bank, bg: string, items: SceneItem[], zh: string, en: string, qs: StoryQ[], d: 1 | 2 | 3, tag: string) {
  qs.forEach((q) =>
    b.add({
      topic: "story", d,
      qz: `${zh}\n${q.qz}`,
      qe: `${en}\n${q.qe}`,
      audio: `${zh}${q.qz}`,
      img: "scene", cfg: { bg, items },
      style: q.style,
      right: q.right, wrong: q.wrong, ez: q.ez, ee: q.ee,
      tags: ["故事理解", tag],
    }),
  );
}

export function addK2More(b: Bank) {
  // ================= 量詞 =================
  const MW = [
    { zh: "個", en: "for round or general things" },
    { zh: "隻", en: "for animals" },
    { zh: "本", en: "for books" },
    { zh: "朵", en: "for flowers and clouds" },
    { zh: "枝", en: "for pens and pencils" },
  ];
  const mwChoice = (zh: string) => c(zh, MW.find((m) => m.zh === zh)!.en);
  interface Item { mw: string; name: string; en: string; icon: string; color?: string }
  const ITEMS: Item[] = [
    { mw: "個", name: "蘋果", en: "apple", icon: "apple" },
    { mw: "個", name: "皮球", en: "ball", icon: "ball" },
    { mw: "個", name: "氣球", en: "balloon", icon: "balloon", color: "#a855f7" },
    { mw: "隻", name: "貓", en: "cat", icon: "cat" },
    { mw: "隻", name: "鳥", en: "bird", icon: "bird" },
    { mw: "隻", name: "兔", en: "rabbit", icon: "rabbit" },
    { mw: "本", name: "紅色嘅書", en: "red book", icon: "book", color: "#ef4444" },
    { mw: "本", name: "藍色嘅書", en: "blue book", icon: "book", color: "#3b82f6" },
    { mw: "本", name: "綠色嘅書", en: "green book", icon: "book", color: "#22c55e" },
    { mw: "朵", name: "粉紅色嘅花", en: "pink flower", icon: "flower" },
    { mw: "朵", name: "黃色嘅花", en: "yellow flower", icon: "flower", color: "#fde047" },
    { mw: "朵", name: "白雲", en: "white cloud", icon: "cloud" },
    { mw: "枝", name: "黃色嘅鉛筆", en: "yellow pencil", icon: "pencil" },
    { mw: "枝", name: "藍色嘅鉛筆", en: "blue pencil", icon: "pencil", color: "#3b82f6" },
    { mw: "枝", name: "紅色嘅鉛筆", en: "red pencil", icon: "pencil", color: "#ef4444" },
  ];
  ITEMS.forEach((x) =>
    b.add({
      topic: "measure", d: 1,
      qz: `一（　）${x.name}`,
      qe: `Pick the right measure word: one ___ ${x.en}`,
      audio: `一，${x.name}。要用邊個量詞？`,
      img: "icon", cfg: { name: x.icon, color: x.color, size: 120 },
      right: mwChoice(x.mw),
      wrong: pick(MW.filter((m) => m.zh !== x.mw), [], 3, b.n).map((m) => mwChoice(m.zh)),
      ez: `「一${x.mw}${x.name}」：${x.en}用「${x.mw}」。`,
      ee: `We say "一${x.mw}${x.name}". "${x.mw}" is used ${MW.find((m) => m.zh === x.mw)!.en}.`,
      tags: ["量詞", x.mw],
    }),
  );
  const REV = [
    { mw: "個", right: ITEMS[2] }, { mw: "隻", right: ITEMS[4] }, { mw: "本", right: ITEMS[7] },
    { mw: "朵", right: ITEMS[9] }, { mw: "枝", right: ITEMS[13] },
  ];
  REV.forEach((r) => {
    const others = ITEMS.filter((x) => x.mw !== r.mw).map((x) => ({ zh: x.name, en: x.en, icon: x.icon, color: x.color }));
    b.add({
      topic: "measure", d: 2,
      qz: `邊個可以用「一${r.mw}」嚟數？`,
      qe: `Which one can be counted with "一${r.mw}"?`,
      style: "icon",
      right: c(r.right.name, r.right.en, { icon: r.right.icon, iconColor: r.right.color }),
      wrong: pick(others, [], 3, b.n).map((o) => c(o.zh, o.en, { icon: o.icon, iconColor: o.color })),
      ez: `「${r.mw}」${MW.find((m) => m.zh === r.mw)!.en}，所以係「一${r.mw}${r.right.name}」。`,
      ee: `"${r.mw}" is used ${MW.find((m) => m.zh === r.mw)!.en}.`,
      tags: ["量詞", r.mw],
    });
  });

  // ================= 句子 =================
  interface Sen { zh: string; en: string; icon: string; color?: string; g: string }
  const SEN: Sen[] = [
    { zh: "這是一隻貓。", en: "This is a cat.", icon: "cat", g: "a" },
    { zh: "這是一隻狗。", en: "This is a dog.", icon: "dog", g: "a" },
    { zh: "這是一隻鳥。", en: "This is a bird.", icon: "bird", g: "a" },
    { zh: "我喜歡蘋果。", en: "I like apples.", icon: "apple", g: "b" },
    { zh: "我喜歡香蕉。", en: "I like bananas.", icon: "banana", g: "b" },
    { zh: "我喜歡牛奶。", en: "I like milk.", icon: "milk", g: "b" },
    { zh: "它是紅色。", en: "It is red.", icon: "balloon", color: "#ef4444", g: "c" },
    { zh: "它是藍色。", en: "It is blue.", icon: "ball", color: "#3b82f6", g: "c" },
    { zh: "它是黃色。", en: "It is yellow.", icon: "star", color: "#facc15", g: "c" },
    { zh: "它是綠色。", en: "It is green.", icon: "tree", color: "#22c55e", g: "c" },
    { zh: "我是小朋友。", en: "I am a child.", icon: "kid", g: "d" },
    { zh: "我有一本書。", en: "I have a book.", icon: "book", g: "d" },
  ];
  SEN.forEach((s, i) => {
    const same = SEN.filter((x) => x.g === s.g && x.zh !== s.zh);
    const diff = pick(SEN.filter((x) => x.g !== s.g), [], 3, i);
    const wrong = [...pick(same, [], 2, i), ...diff].slice(0, 3);
    b.add({
      topic: "sentences", d: 1,
      qz: "邊句說話配合圖畫？", qe: "Which sentence matches the picture?",
      audio: "邊句說話配合圖畫？",
      img: "icon", cfg: { name: s.icon, color: s.color, size: 120 },
      right: c(s.zh, s.en), wrong: wrong.map((w) => c(w.zh, w.en)),
      ez: `${s.zh}`, ee: s.en,
      tags: ["句子配對", s.zh],
    });
  });
  const CLOZE = [
    { pre: "這是一隻", post: "。", ans: ANIMALS[0], pool: ANIMALS, en: "This is a ___." },
    { pre: "這是一隻", post: "。", ans: ANIMALS[1], pool: ANIMALS, en: "This is a ___." },
    { pre: "這是一隻", post: "。", ans: ANIMALS[2], pool: ANIMALS, en: "This is a ___." },
    { pre: "我喜歡", post: "。", ans: FOODS[0], pool: FOODS, en: "I like ___." },
    { pre: "我喜歡", post: "。", ans: FOODS[1], pool: FOODS, en: "I like ___." },
    { pre: "我喜歡", post: "。", ans: FOODS[3], pool: FOODS, en: "I like ___." },
  ];
  CLOZE.forEach((x) =>
    b.add({
      topic: "sentences", d: 1,
      qz: `${x.pre}（　）${x.post}`, qe: `Look at the picture and fill the blank: ${x.en}`,
      audio: `${x.pre}，${x.ans.zh}${x.post}請睇圖，填上啱嘅字。`,
      img: "icon", cfg: { name: x.ans.icon, size: 110 },
      right: ch(x.ans, false), wrong: pick(x.pool, [x.ans.zh], 3, b.n).map((w) => ch(w, false)),
      ez: `${x.pre}${x.ans.zh}${x.post}`, ee: `${x.en.replace("___", x.ans.en)}`,
      tags: ["句子填空", x.ans.zh],
    }),
  );

  // ================= 聆聽 =================
  const lq = ["聽一聽，邊幅圖係你聽到嘅？", "留心聽，你聽到邊個？", "聽聽睇，邊個係正確嘅？"];
  const listenWords = (pool: typeof ANIMALS, picks: number[], tag: string) =>
    picks.forEach((idx) => {
      const w = pool[idx];
      b.add({
        topic: "listening", d: 1,
        qz: lq[b.n % 3], qe: "Listen. Which picture did you hear?",
        audio: w.zh,
        style: "icon",
        right: ch(w), wrong: pick(pool, [w.zh], 3, b.n).map((x) => ch(x)),
        ez: `你聽到嘅係「${w.zh}」。`, ee: `You heard "${w.zh}" (${w.en}).`,
        tags: ["聆聽", tag, w.zh],
      });
    });
  listenWords(ANIMALS, [0, 1, 3, 4, 5, 7], "動物");
  listenWords(FOODS as typeof ANIMALS, [3, 4, 5, 6], "食物");
  listenWords(BODY as typeof ANIMALS, [1, 2, 3, 5], "身體");
  listenWords(FAMILY as typeof ANIMALS, [0, 1, 5], "家人");
  const LN = [3, 5, 8];
  const LI = ["star", "apple", "balloon"];
  const nearN = (n: number) => [n - 2, n - 1, n + 1, n + 2, n + 3].filter((x) => x >= 1 && x <= 10 && x !== n);
  LN.forEach((n, i) =>
    b.add({
      topic: "listening", d: 2,
      qz: "聽一聽，邊一組嘅數量係你聽到嘅數字？", qe: "Listen. Which group matches the number you heard?",
      audio: NUMS[n - 1],
      style: "icon",
      right: c(NUMS[n - 1], String(n), { icon: LI[i], count: n }),
      wrong: pick(nearN(n).map((x) => ({ zh: NUMS[x - 1], en: String(x) })), [], 3, b.n).map((x) => c(x.zh, x.en, { icon: LI[i], count: Number(x.en) })),
      ez: `你聽到嘅係「${NUMS[n - 1]}」，即係 ${n}。`, ee: `You heard "${NUMS[n - 1]}", which is ${n}.`,
      tags: ["聆聽", "數字", NUMS[n - 1]],
    }),
  );

  // ================= 故事 =================
  addStory(b, "park", [it("sun", 236, 4, 46), it("tree", 14, 34, 86), it("cat", 118, 72, 58), it("butterfly", 206, 54, 40)],
    "小貓喺公園玩。牠見到一隻蝴蝶。", "The kitten plays in the park. It sees a butterfly.", [
      { qz: "小貓見到咩？", qe: "What does the kitten see?", right: c("蝴蝶", "butterfly", { icon: "butterfly" }), wrong: [c("魚", "fish", { icon: "fish" }), c("星星", "star", { icon: "star" }), c("小狗", "puppy", { icon: "dog" })], ez: "故事話小貓見到一隻蝴蝶。", ee: "The story says the kitten sees a butterfly." },
      { qz: "小貓喺邊度玩？", qe: "Where does the kitten play?", right: c("公園", "park", { icon: "tree" }), wrong: [c("學校", "school", { icon: "school" }), c("海邊", "beach", { icon: "boat" }), c("山上", "mountain", { icon: "mountain" })], ez: "小貓喺公園玩。", ee: "The kitten plays in the park." },
    ], 1, "公園");
  addStory(b, "rain", [it("rain", 100, 0, 90), it("kid", 40, 54, 80), it("umbrella", 126, 56, 62, "#f97316")],
    "今日落雨。小明帶咗一把遮。", "It is raining today. Siu Ming brings an umbrella.", [
      { qz: "小明帶咗咩？", qe: "What did Siu Ming bring?", right: c("遮", "umbrella", { icon: "umbrella" }), wrong: [c("帽", "hat", { icon: "hat" }), c("皮球", "ball", { icon: "ball" }), c("書", "book", { icon: "book" })], ez: "落雨要帶遮。", ee: "We bring an umbrella when it rains." },
    ], 1, "雨天");
  addStory(b, "room", [it("mom", 40, 40, 90), it("rice", 170, 62, 64)],
    "媽媽煮咗飯。我哋一齊食飯。", "Mum cooked rice. We eat together.", [
      { qz: "媽媽煮咗咩？", qe: "What did Mum cook?", right: c("飯", "rice", { icon: "rice" }), wrong: [c("麵包", "bread", { icon: "bread" }), c("蘋果", "apple", { icon: "apple" }), c("牛奶", "milk", { icon: "milk" })], ez: "媽媽煮咗飯。", ee: "Mum cooked rice." },
      { qz: "邊個煮飯？", qe: "Who cooked the meal?", right: c("媽媽", "Mum"), wrong: [c("爸爸", "Dad"), c("姐姐", "older sister"), c("哥哥", "older brother")], ez: "故事話媽媽煮飯。", ee: "The story says Mum cooked." },
    ], 1, "家庭");
  addStory(b, "night", [it("moon", 200, 8, 70), it("star", 40, 14, 30), it("star", 120, 30, 24), it("bed", 40, 70, 80), it("lilbro", 170, 58, 70)],
    "天黑咗，月亮出嚟。弟弟瞓覺。", "It is dark and the moon comes out. Little brother goes to sleep.", [
      { qz: "夜晚天空有咩？", qe: "What is in the sky at night?", right: c("月亮", "moon", { icon: "moon" }), wrong: [c("太陽", "sun", { icon: "sun" }), c("雨", "rain", { icon: "rain" }), c("風", "wind", { icon: "wind" })], ez: "天黑咗，月亮出嚟。", ee: "When it gets dark, the moon comes out." },
    ], 1, "夜晚");
  addStory(b, "park", [it("tree", 80, 18, 120), it("bird", 128, 28, 44), it("sun", 240, 6, 44)],
    "小鳥喺樹上唱歌。牠好開心。", "The little bird sings on the tree. It is very happy.", [
      { qz: "小鳥喺邊度？", qe: "Where is the little bird?", right: c("樹上", "on the tree"), wrong: [c("水入面", "in the water"), c("屋入面", "inside the house"), c("地下", "on the ground")], ez: "小鳥喺樹上唱歌。", ee: "The bird sings on the tree." },
    ], 1, "動物");
  addStory(b, "room", [it("dad", 20, 44, 90), it("apple", 120, 68, 50), it("lilsis", 200, 58, 74)],
    "爸爸買咗一個大蘋果。我分咗一半俾妹妹。", "Dad bought a big apple. I gave half to my little sister.", [
      { qz: "我分咗一半蘋果俾邊個？", qe: "Who got half of the apple?", right: c("妹妹", "younger sister"), wrong: [c("爸爸", "Dad"), c("媽媽", "Mum"), c("哥哥", "older brother")], ez: "我分咗一半俾妹妹。", ee: "I gave half to my younger sister." },
    ], 1, "家庭");
  addStory(b, "park", [it("fish", 40, 70, 56), it("drop", 120, 74, 30, "#38bdf8"), it("drop", 160, 84, 24, "#38bdf8"), it("fish", 200, 76, 44, "#f472b6")],
    "小魚住喺水入面。牠最喜歡游水。", "The little fish lives in the water. It loves to swim.", [
      { qz: "小魚住喺邊度？", qe: "Where does the little fish live?", right: c("水入面", "in the water"), wrong: [c("樹上", "on the tree"), c("天空", "in the sky"), c("山上", "on the mountain")], ez: "小魚住喺水入面。", ee: "The little fish lives in the water." },
    ], 1, "動物");
  addStory(b, "park", [it("brother", 40, 38, 90), it("ball", 160, 80, 40), it("sun", 240, 6, 44)],
    "哥哥踢波，我喺旁邊拍手。", "Older brother kicks the ball. I clap beside him.", [
      { qz: "邊個踢波？", qe: "Who kicks the ball?", right: c("哥哥", "older brother"), wrong: [c("我", "me"), c("媽媽", "Mum"), c("爸爸", "Dad")], ez: "哥哥踢波。", ee: "Older brother kicks the ball." },
    ], 1, "遊戲");
  addStory(b, "park", [it("sun", 110, 4, 70), it("flower", 40, 50, 66), it("flower", 200, 56, 56, "#fb923c")],
    "太陽出嚟了。小花向太陽笑。", "The sun comes out. The little flowers smile at the sun.", [
      { qz: "邊個出嚟了？", qe: "What came out?", right: c("太陽", "sun", { icon: "sun" }), wrong: [c("月亮", "moon", { icon: "moon" }), c("雲", "cloud", { icon: "cloud" }), c("雨", "rain", { icon: "rain" })], ez: "太陽出嚟了。", ee: "The sun came out." },
    ], 1, "大自然");
  addStory(b, "park", [it("balloon", 120, 4, 80, "#ef4444"), it("kid", 20, 50, 80)],
    "我有一個紅色氣球。氣球飛上天空。", "I have a red balloon. The balloon flies into the sky.", [
      { qz: "氣球係咩顏色？", qe: "What colour is the balloon?", style: "color", right: colorChoice(COLORS[0]), wrong: [COLORS[2], COLORS[1], COLORS[3]].map(colorChoice), ez: "我有一個紅色氣球。", ee: "I have a red balloon." },
    ], 1, "顏色");

  // ================= 生活常識 =================
  const PH = {
    morning: c("早晨！", "Good morning!"),
    hello: c("你好！", "Hello!"),
    thanks: c("多謝！", "Thank you!"),
    sorry: c("對唔住！", "Sorry!"),
    bye: c("再見！", "Goodbye!"),
    night: c("晚安！", "Good night!"),
    please: c("請借俾我。", "Please lend it to me."),
  };
  const phPool = Object.values(PH);
  const SIT: { qz: string; qe: string; icon: string; right: Choice; ez: string; ee: string; tag: string }[] = [
    { qz: "早上返學，見到老師。你會講咩？", qe: "You see your teacher in the morning. What do you say?", icon: "teacher", right: PH.morning, ez: "早上見到人，我哋講「早晨」。", ee: "In the morning we say \"早晨\" (good morning).", tag: "打招呼" },
    { qz: "放學了，同老師揮手。你會講咩？", qe: "School is over and you wave to the teacher. What do you say?", icon: "school", right: PH.bye, ez: "分開嗰陣，我哋講「再見」。", ee: "When we part we say \"再見\" (goodbye).", tag: "再見" },
    { qz: "見到新同學。你會講咩？", qe: "You meet a new classmate. What do you say?", icon: "friends", right: PH.hello, ez: "見面時講「你好」，好有禮貌。", ee: "Saying \"你好\" (hello) is polite.", tag: "打招呼" },
    { qz: "朋友送你一份生日禮物。你會講咩？", qe: "A friend gives you a birthday present. What do you say?", icon: "cake", right: PH.thanks, ez: "收到禮物要講「多謝」。", ee: "When you get a gift, say \"多謝\" (thank you).", tag: "多謝" },
    { qz: "媽媽幫你整好早餐。你會講咩？", qe: "Mum made your breakfast. What do you say?", icon: "bread", right: PH.thanks, ez: "有人幫你，記得講「多謝」。", ee: "When someone helps you, say \"多謝\".", tag: "多謝" },
    { qz: "你不小心踩到同學隻腳。你會講咩？", qe: "You accidentally step on a classmate's foot. What do you say?", icon: "foot", right: PH.sorry, ez: "弄到人，要講「對唔住」。", ee: "If you bump into someone, say \"對唔住\" (sorry).", tag: "對唔住" },
    { qz: "你弄跌咗弟弟嘅積木。你會講咩？", qe: "You knocked down your little brother's blocks. What do you say?", icon: "blocks", right: PH.sorry, ez: "講聲「對唔住」，再幫手砌返好。", ee: "Say \"對唔住\" and help rebuild them.", tag: "對唔住" },
    { qz: "你想朋友借枝筆俾你。你會講咩？", qe: "You want to borrow a pencil from a friend. What do you say?", icon: "pencil", right: PH.please, ez: "想借嘢，要講「請」。", ee: "When we ask for something, we say \"請\" (please).", tag: "請" },
    { qz: "晚上瞓覺前，同媽媽講咩？", qe: "What do you say to Mum before bed?", icon: "bed", right: PH.night, ez: "瞓覺前講「晚安」。", ee: "Before sleeping, say \"晚安\" (good night).", tag: "打招呼" },
    { qz: "放學後，同朋友揮手。你會講咩？", qe: "After school you wave to your friends. What do you say?", icon: "friends", right: PH.bye, ez: "同朋友分開，講「再見」。", ee: "Say \"再見\" when you say goodbye to friends.", tag: "再見" },
    { qz: "朋友借咗枝蠟筆俾你。你會講咩？", qe: "A friend lent you a crayon. What do you say?", icon: "pencil", right: PH.thanks, ez: "有人借嘢俾你，要講「多謝」。", ee: "Thank people who lend you things.", tag: "多謝" },
  ];
  SIT.forEach((s) =>
    b.add({
      topic: "life", d: 1,
      qz: s.qz, qe: s.qe,
      img: "icon", cfg: { name: s.icon, size: 110, color: s.icon === "pencil" ? "#22c55e" : undefined },
      right: s.right, wrong: pick(phPool, [s.right.zh], 3, b.n),
      ez: s.ez, ee: s.ee, tags: ["生活情境", s.tag],
    }),
  );
  const HAB = [
    { qz: "食飯之前，要做咩？", qe: "What should we do before eating?", right: c("洗手", "wash hands", { icon: "hand" }), wrong: [c("玩積木", "play with blocks", { icon: "blocks" }), c("踢波", "kick a ball", { icon: "ball" }), c("瞓覺", "go to sleep", { icon: "bed" })], ez: "食飯之前要洗手，先衞生。", ee: "Wash hands before eating to stay clean." },
    { qz: "落雨出街，要帶咩？", qe: "What do we bring when it rains?", right: c("遮", "umbrella", { icon: "umbrella" }), wrong: [c("皮球", "ball", { icon: "ball" }), c("蛋糕", "cake", { icon: "cake" }), c("書包", "school bag", { icon: "bag" })], ez: "落雨要帶遮。", ee: "Bring an umbrella when it rains." },
    { qz: "瞓覺要喺邊度？", qe: "Where do we sleep?", right: c("床", "bed", { icon: "bed" }), wrong: [c("枱", "table", { icon: "table" }), c("馬路", "road", { icon: "road" }), c("汽車", "car", { icon: "car" })], ez: "我哋喺床上瞓覺。", ee: "We sleep in a bed." },
    { qz: "口渴嗰陣，可以飲咩？", qe: "What can we drink when we are thirsty?", right: c("水", "water", { icon: "water" }), wrong: [c("飯", "rice", { icon: "rice" }), c("麵包", "bread", { icon: "bread" }), c("書", "book", { icon: "book" })], ez: "口渴可以飲水。", ee: "We can drink water when we are thirsty." },
  ];
  HAB.forEach((h) =>
    b.add({ topic: "life", d: 1, qz: h.qz, qe: h.qe, right: h.right, wrong: h.wrong, ez: h.ez, ee: h.ee, tags: ["生活常識", "日常"] }),
  );
}
