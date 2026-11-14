// Web Audio 音效與背景音樂（全部由程式即時合成，無外部音檔）
import { getState } from "./store";
import { cancelSpeech, isSpeaking, onSpeakingChange } from "./speechEngine";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let nextNoteTime = 0;
let sfxUntil = 0; // 音效播放中嘅時間，用嚟避免與朗讀重疊

type ACtor = typeof AudioContext;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC: ACtor | undefined = window.AudioContext || (window as unknown as { webkitAudioContext?: ACtor }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = isSpeaking() ? 0.0 : 0.05;
      musicGain.connect(ctx.destination);
    } catch {
      ctx = null;
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// 朗讀時降低背景音樂
onSpeakingChange((speaking) => {
  if (!ctx || !musicGain) return;
  musicGain.gain.setTargetAtTime(speaking ? 0.0 : 0.05, ctx.currentTime, 0.08);
});

function tone(freq: number, start: number, dur: number, opts: { type?: OscillatorType; gain?: number; glideTo?: number; dest?: AudioNode } = {}) {
  const c = ctx;
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = opts.type ?? "sine";
  o.frequency.setValueAtTime(freq, start);
  if (opts.glideTo) o.frequency.exponentialRampToValueAtTime(opts.glideTo, start + dur);
  const peak = opts.gain ?? 0.2;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g);
  g.connect(opts.dest ?? master);
  o.start(start);
  o.stop(start + dur + 0.05);
}

const N = {
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  C6: 1046.5, E6: 1318.5, G6: 1568.0,
};

function prepare(totalSec: number): AudioContext | null {
  if (!getState().settings.sound) return null;
  // 音效與朗讀不可同時播放
  cancelSpeech();
  const c = getCtx();
  if (!c) return null;
  sfxUntil = c.currentTime + totalSec;
  return c;
}

export type Sfx = "click" | "correct" | "wrong" | "star" | "win" | "combo" | "pop";

export function playSfx(name: Sfx) {
  switch (name) {
    case "click": {
      const c = prepare(0.1);
      if (!c) return;
      const t = c.currentTime;
      tone(660, t, 0.08, { type: "triangle", gain: 0.15, glideTo: 880 });
      break;
    }
    case "pop": {
      const c = prepare(0.12);
      if (!c) return;
      tone(500, c.currentTime, 0.1, { type: "sine", gain: 0.15, glideTo: 900 });
      break;
    }
    case "correct": {
      const c = prepare(0.6);
      if (!c) return;
      const t = c.currentTime;
      tone(N.C5, t, 0.18, { gain: 0.22 });
      tone(N.E5, t + 0.09, 0.18, { gain: 0.22 });
      tone(N.G5, t + 0.18, 0.4, { gain: 0.24 });
      tone(N.C6, t + 0.18, 0.4, { gain: 0.1 });
      break;
    }
    case "wrong": {
      const c = prepare(0.45);
      if (!c) return;
      const t = c.currentTime;
      // 柔和低音，唔會嚇到小朋友
      tone(330, t, 0.25, { type: "sine", gain: 0.14, glideTo: 262 });
      tone(262, t + 0.18, 0.28, { type: "sine", gain: 0.1, glideTo: 247 });
      break;
    }
    case "star": {
      const c = prepare(0.5);
      if (!c) return;
      const t = c.currentTime;
      tone(N.G5, t, 0.12, { type: "triangle", gain: 0.16 });
      tone(N.C6, t + 0.08, 0.14, { type: "triangle", gain: 0.16 });
      tone(N.E6, t + 0.16, 0.14, { type: "triangle", gain: 0.16 });
      tone(N.G6, t + 0.24, 0.25, { type: "triangle", gain: 0.14 });
      break;
    }
    case "combo": {
      const c = prepare(0.6);
      if (!c) return;
      const t = c.currentTime;
      [N.C5, N.E5, N.G5, N.C6, N.E6].forEach((f, i) => tone(f, t + i * 0.07, 0.2, { type: "triangle", gain: 0.17 }));
      break;
    }
    case "win": {
      const c = prepare(2.2);
      if (!c) return;
      const t = c.currentTime;
      const mel: [number, number, number][] = [
        [N.C5, 0, 0.2], [N.E5, 0.2, 0.2], [N.G5, 0.4, 0.2], [N.C6, 0.6, 0.4],
        [N.G5, 1.05, 0.15], [N.C6, 1.2, 0.15], [N.E6, 1.4, 0.7],
      ];
      mel.forEach(([f, s, d]) => {
        tone(f, t + s, d + 0.1, { type: "triangle", gain: 0.2 });
        tone(f / 2, t + s, d + 0.1, { type: "sine", gain: 0.08 });
      });
      break;
    }
  }
}

/** 兩個音效之間嘅最少等待（毫秒），供朗讀排程用 */
export function sfxRemainingMs(): number {
  if (!ctx) return 0;
  return Math.max(0, (sfxUntil - ctx.currentTime) * 1000);
}

// ---- 背景音樂：五聲音階、輕快、可循環 ----
const MELODY = [
  N.C5, N.E5, N.G5, N.E5, N.A5, N.G5, N.E5, N.D5,
  N.C5, N.D5, N.E5, N.G5, N.E5, N.D5, N.C5, 0,
  N.G4, N.C5, N.E5, N.C5, N.A4, N.C5, N.D5, N.E5,
  N.G5, N.E5, N.D5, N.C5, N.D5, N.E5, N.C5, 0,
];
const BASS = [N.C4, N.G4, N.A4, N.G4];
const STEP = 0.3;

function scheduleMusic() {
  const c = ctx;
  if (!c || !musicGain) return;
  while (nextNoteTime < c.currentTime + 0.6) {
    const f = MELODY[musicStep % MELODY.length];
    if (f) tone(f, nextNoteTime, STEP * 0.9, { type: "triangle", gain: 0.9, dest: musicGain });
    if (musicStep % 4 === 0) tone(BASS[(musicStep / 4) % BASS.length] / 2, nextNoteTime, STEP * 3, { type: "sine", gain: 0.7, dest: musicGain });
    nextNoteTime += STEP;
    musicStep++;
  }
}

export function startMusic() {
  if (musicTimer !== null) return;
  if (!getState().settings.music) return;
  const c = getCtx();
  if (!c) return;
  nextNoteTime = c.currentTime + 0.1;
  scheduleMusic();
  musicTimer = window.setInterval(scheduleMusic, 200);
}

export function stopMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}

/** 需要使用者互動後先可以開始音訊（瀏覽器限制） */
export function unlockAudio() {
  getCtx();
  if (getState().settings.music) startMusic();
}
