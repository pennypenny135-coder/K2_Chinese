// 朗讀引擎：優先廣東話 (zh-HK / yue)，否則用其他中文語音
import { getState } from "./store";

type Listener = (speaking: boolean) => void;
const listeners = new Set<Listener>();
let voice: SpeechSynthesisVoice | null = null;
let speaking = false;
let token = 0;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

export function onSpeakingChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setSpeaking(v: boolean) {
  if (speaking === v) return;
  speaking = v;
  listeners.forEach((l) => l(v));
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const lc = (s: string) => s.toLowerCase().replace("_", "-");
  const cantonese = voices.find((v) => /zh-hk|yue/.test(lc(v.lang)));
  if (cantonese) return cantonese;
  const byName = voices.find((v) => /cantonese|粵|粤|廣東|广东|sin-?ji|sinji|hiugaai|wanlung|hong kong/i.test(v.name));
  if (byName) return byName;
  return (
    voices.find((v) => /zh-tw/.test(lc(v.lang))) ||
    voices.find((v) => /^zh/.test(lc(v.lang))) ||
    voices.find((v) => /chinese|中文|mandarin|國語|普通话/i.test(v.name)) ||
    null
  );
}

export function initSpeech() {
  if (!isSpeechSupported()) return;
  voice = pickVoice();
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      voice = pickVoice();
    };
  } catch {
    /* ignore */
  }
}

export function cancelSpeech() {
  token++;
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  setSpeaking(false);
}

/** 朗讀文字。force=true 時，即使設定關閉都會朗讀（手動按喇叭） */
export function speakText(text: string, opts: { force?: boolean; onEnd?: () => void } = {}) {
  if (!isSpeechSupported()) return;
  if (!opts.force && !getState().settings.speech) return;
  if (!text.trim()) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    if (!voice) voice = pickVoice();
    const my = ++token;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang ?? "zh-HK";
    if (voice) u.voice = voice;
    u.rate = 0.7; // 慢速、清晰
    u.pitch = 1.1;
    u.volume = 1;
    u.onstart = () => {
      if (my === token) setSpeaking(true);
    };
    const done = () => {
      if (my !== token) return;
      setSpeaking(false);
      opts.onEnd?.();
    };
    u.onend = done;
    u.onerror = done;
    setSpeaking(true);
    synth.speak(u);
  } catch {
    setSpeaking(false);
  }
}

export function isSpeaking() {
  return speaking;
}
