import { ALL_QUESTIONS, getBankStats } from "../src/data/questions";
import { ICON_NAMES } from "../src/components/Illustration";

const issues: string[] = [];
const ids = new Set<string>();
const sigs = new Map<string, string>();
const SIMPLIFIED = "这个们来说话还没时间学习书写两别买门问开关见长东马鸟鱼鸡饭汤爱听让认对为从国图园乐边写实现经师现发给红绿颜师师觉";
const BAD = ["笨", "差勁", "又錯", "蠢", "錯誤"];
const icons = new Set(ICON_NAMES);

for (const q of ALL_QUESTIONS) {
  const tag = q.id;
  if (ids.has(q.id)) issues.push(`${tag}: duplicate id`);
  ids.add(q.id);
  if (q.choices.length !== 4) issues.push(`${tag}: choices != 4`);
  if (q.correctIndex < 0 || q.correctIndex > 3) issues.push(`${tag}: bad correctIndex`);
  const zhs = q.choices.map((c) => c.zh);
  if (new Set(zhs).size !== 4) issues.push(`${tag}: duplicate choices ${zhs.join("|")} (${q.questionZh})`);
  for (const c of q.choices) {
    if (!c.zh || !c.en) issues.push(`${tag}: choice missing zh/en`);
    if (c.icon && !icons.has(c.icon)) issues.push(`${tag}: unknown icon ${c.icon}`);
  }
  const cfg = q.imageConfig as Record<string, unknown>;
  if (typeof cfg.name === "string" && !icons.has(cfg.name)) issues.push(`${tag}: unknown cfg icon ${cfg.name}`);
  if (Array.isArray(cfg.items)) for (const it of cfg.items as { icon: string }[]) if (!icons.has(it.icon)) issues.push(`${tag}: unknown scene icon ${it.icon}`);
  if (typeof cfg.obj === "string" && !icons.has(cfg.obj)) issues.push(`${tag}: unknown obj ${cfg.obj}`);
  const all = [q.questionZh, q.audioText, q.explanationZh, ...zhs].join("");
  for (const ch of all) if (SIMPLIFIED.includes(ch)) issues.push(`${tag}: possible simplified char ${ch}`);
  for (const w of BAD) if (all.includes(w)) issues.push(`${tag}: negative word ${w}`);
  for (const f of ["questionZh", "questionEn", "audioText", "explanationZh", "explanationEn"] as const) if (!q[f] || !String(q[f]).trim()) issues.push(`${tag}: empty ${f}`);
  if (!q.tags.length) issues.push(`${tag}: no tags`);
  const sig = q.level + q.questionZh + JSON.stringify(q.imageConfig) + [...zhs].sort().join(",") + q.choices[q.correctIndex].zh;
  if (sigs.has(sig)) issues.push(`${tag}: duplicate of ${sigs.get(sig)}`);
  sigs.set(sig, q.id);
}
const stats = getBankStats();
console.log(JSON.stringify(stats, null, 1));
const idx = [0, 0, 0, 0];
ALL_QUESTIONS.forEach((q) => idx[q.correctIndex]++);
console.log("correctIndex distribution", idx);
console.log("issues:", issues.length);
issues.slice(0, 80).forEach((i) => console.log(" -", i));
