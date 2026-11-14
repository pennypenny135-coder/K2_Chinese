import type { ReactNode } from "react";
import { navigate } from "@/lib/router";
import { useSound } from "@/hooks/useSound";
import { isSpeechSupported } from "@/lib/speechEngine";
import { useProgress } from "@/hooks/useProgress";
import { T, type Bi as BiText } from "@/lib/i18n";
import Bi from "./Bi";
import { cn } from "@/utils/cn";

function Toggle({ on, onClick, icon, label }: { on: boolean; onClick: () => void; icon: string; label: BiText }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={`${label.zh} ${label.en} ${on ? "開 on" : "關 off"}`}
      className={cn(
        "flex h-12 min-w-12 flex-col items-center justify-center rounded-2xl border-2 border-white px-2 text-[10px] font-bold leading-none shadow",
        on ? "bg-white text-sky-700" : "bg-slate-300/80 text-slate-500",
      )}
    >
      <span className="text-xl leading-none">{on ? icon : "🔇"}</span>
      <span className="mt-0.5">{label.zh}</span>
    </button>
  );
}

export function SettingsBar() {
  const { settings, toggleSound, toggleMusic, toggleSpeech, play } = useSound();
  return (
    <div className="flex items-center gap-1.5">
      <Toggle on={settings.sound} icon="🔔" label={T.sound} onClick={() => { toggleSound(); if (!settings.sound) setTimeout(() => play("click"), 50); }} />
      <Toggle on={settings.music} icon="🎵" label={T.music} onClick={toggleMusic} />
      {isSpeechSupported() && <Toggle on={settings.speech} icon="🗣️" label={T.speech} onClick={toggleSpeech} />}
    </div>
  );
}

export function BackButton({ to, label = T.back }: { to: string; label?: BiText }) {
  const { play } = useSound();
  return (
    <button
      type="button"
      onClick={() => {
        play("click");
        navigate(to);
      }}
      className="btn-big flex h-14 min-h-14 items-center gap-2 rounded-full border-4 border-white bg-orange-400 px-4 text-white"
      aria-label={`${label.zh} ${label.en}`}
    >
      <span className="text-2xl font-black">◀</span>
      <Bi t={label} zhClass="text-lg" enClass="text-[11px]" align="left" />
    </button>
  );
}

const CLOUDS = [
  { top: "6%", dur: 60, delay: -10, s: 0.9 },
  { top: "18%", dur: 85, delay: -50, s: 0.6 },
  { top: "32%", dur: 70, delay: -30, s: 0.75 },
];

export function PageShell({ children, back, header, className }: { children: ReactNode; back?: string; header?: ReactNode; className?: string }) {
  const { storageOk } = useProgress();
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden" aria-hidden="true">
        {CLOUDS.map((c, i) => (
          <div key={i} className="cloud" style={{ top: c.top, ["--cdur" as string]: `${c.dur}s`, ["--cdelay" as string]: `${c.delay}s`, transform: `scale(${c.s})` }}>
            <svg width="120" height="60" viewBox="0 0 120 60">
              <g fill="#fff">
                <circle cx="35" cy="36" r="20" />
                <circle cx="62" cy="28" r="26" />
                <circle cx="90" cy="38" r="18" />
                <rect x="35" y="36" width="55" height="20" />
              </g>
            </svg>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-400/70 to-transparent" aria-hidden="true" />
      <div className={cn("relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-8 pt-3", className)}>
        <div className="mb-3 flex items-center justify-between gap-2">
          {back ? <BackButton to={back} /> : header ?? <span />}
          <SettingsBar />
        </div>
        {!storageOk && (
          <div className="mb-3 rounded-2xl bg-amber-100 px-3 py-2 text-center text-sm font-bold text-amber-800">
            <Bi t={T.storageOff} zhClass="text-sm" enClass="text-xs" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
