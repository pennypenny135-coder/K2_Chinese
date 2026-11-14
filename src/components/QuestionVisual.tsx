import type { ReactNode } from "react";
import type { Question } from "@/data/types";
import { Icon, IconShape } from "./Illustration";

type Cfg = Record<string, unknown>;
const s = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);
const n = (v: unknown, d = 0): number => (typeof v === "number" ? v : d);

function CharCard({ text, color = "#ef4444", tone = "white", label }: { text: string; color?: string; tone?: "white" | "orange"; label?: string }) {
  const len = [...text].length;
  const size = len === 1 ? 104 : len === 2 ? 76 : len === 3 ? 56 : 44;
  return (
    <div
      className={`relative flex h-40 items-center justify-center rounded-3xl border-4 px-5 shadow-inner ${
        tone === "orange" ? "border-orange-400 bg-orange-50" : "border-rose-300 bg-white"
      }`}
      style={{ minWidth: len === 1 ? 160 : undefined }}
    >
      {len === 1 && (
        <svg className="absolute inset-2" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0V100M0 50H100" stroke="#fda4af" strokeWidth="1" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <span className="relative font-black leading-none" style={{ fontSize: size, color }}>
        {text}
      </span>
      {label && <span className="absolute bottom-1 right-3 text-xs font-bold text-orange-500">{label}</span>}
    </div>
  );
}

function CountGrid({ name, count, color }: { name: string; count: number; color?: string }) {
  const cols = count <= 5 ? count : count <= 10 ? 5 : 10;
  const size = count <= 5 ? 58 : count <= 10 ? 48 : 30;
  return (
    <div className="grid justify-center gap-1 rounded-3xl bg-white/80 p-3" style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name={name} color={color} size={size} />
      ))}
    </div>
  );
}

function StructureDiagram({ kind }: { kind: string }) {
  const stroke = "#5b3a29";
  return (
    <svg viewBox="0 0 120 120" width={150} height={150} aria-hidden="true">
      <rect x="6" y="6" width="108" height="108" rx="12" fill="#fff" stroke={stroke} strokeWidth="3" />
      {kind === "lr" && (
        <>
          <rect x="10" y="10" width="49" height="100" rx="8" fill="#fecaca" />
          <rect x="61" y="10" width="49" height="100" rx="8" fill="#bfdbfe" />
        </>
      )}
      {kind === "tb" && (
        <>
          <rect x="10" y="10" width="100" height="49" rx="8" fill="#fecaca" />
          <rect x="10" y="61" width="100" height="49" rx="8" fill="#bfdbfe" />
        </>
      )}
      {kind === "enclose" && (
        <>
          <rect x="10" y="10" width="100" height="100" rx="8" fill="#fecaca" />
          <rect x="34" y="34" width="52" height="52" rx="6" fill="#bfdbfe" />
        </>
      )}
      {kind === "single" && <rect x="10" y="10" width="100" height="100" rx="8" fill="#fde68a" />}
    </svg>
  );
}

function PositionDiagram({ rel, obj, refIcon }: { rel: string; obj: string; refIcon: string }) {
  const place = (name: string, x: number, y: number, size: number): ReactNode => (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 100 100">
      <IconShape name={name} />
    </svg>
  );
  let content: ReactNode;
  switch (rel) {
    case "on":
      content = (
        <>
          {place("table", 65, 36, 90)}
          {place(obj, 85, 22, 50)}
        </>
      );
      break;
    case "under":
      content = (
        <>
          {place("table", 55, 22, 110)}
          {place(obj, 90, 78, 40)}
        </>
      );
      break;
    case "left":
      content = (
        <>
          {place(obj, 24, 62, 52)}
          {place(refIcon, 115, 24, 90)}
        </>
      );
      break;
    case "right":
      content = (
        <>
          {place(refIcon, 16, 24, 90)}
          {place(obj, 144, 62, 52)}
        </>
      );
      break;
    case "front":
      content = (
        <>
          {place(refIcon, 66, 14, 66)}
          {place(obj, 96, 52, 72)}
        </>
      );
      break;
    case "behind":
      content = (
        <>
          {place(obj, 66, 14, 66)}
          {place(refIcon, 96, 52, 72)}
        </>
      );
      break;
    case "inside":
      content = (
        <>
          <rect x="52" y="62" width="116" height="52" rx="6" fill="#b9854a" stroke="#5b3a29" strokeWidth="3" />
          {place(obj, 86, 36, 52)}
          <rect x="52" y="82" width="116" height="34" rx="6" fill="#d6a46c" stroke="#5b3a29" strokeWidth="3" />
        </>
      );
      break;
    case "outside":
      content = (
        <>
          <rect x="96" y="62" width="104" height="52" rx="6" fill="#b9854a" stroke="#5b3a29" strokeWidth="3" />
          <rect x="96" y="82" width="104" height="34" rx="6" fill="#d6a46c" stroke="#5b3a29" strokeWidth="3" />
          {place(obj, 22, 66, 56)}
        </>
      );
      break;
    default:
      content = place(obj, 80, 40, 60);
  }
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-xs" aria-hidden="true">
      <rect x="0" y="0" width="220" height="130" rx="18" fill="#e0f2fe" />
      <rect x="0" y="112" width="220" height="18" fill="#86efac" />
      {content}
    </svg>
  );
}

interface SceneItem {
  icon: string;
  x: number;
  y: number;
  s: number;
  color?: string;
}
function Scene({ cfg }: { cfg: Cfg }) {
  const bg = s(cfg.bg, "park");
  const items = (Array.isArray(cfg.items) ? cfg.items : []) as SceneItem[];
  const skies: Record<string, [string, string]> = {
    park: ["#bae6fd", "#e0f2fe"],
    rain: ["#94a3b8", "#cbd5e1"],
    night: ["#1e3a8a", "#312e81"],
    room: ["#fde68a", "#fef3c7"],
    sunset: ["#fdba74", "#fde68a"],
  };
  const [top, bottom] = skies[bg] ?? skies.park;
  const ground = bg === "room" ? "#d6a46c" : bg === "night" ? "#14532d" : bg === "rain" ? "#6b8e6b" : "#86efac";
  return (
    <svg viewBox="0 0 300 150" className="w-full max-w-sm rounded-3xl border-4 border-white shadow" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${bg}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="300" height="150" fill={`url(#sky-${bg})`} />
      {bg === "night" && (
        <g fill="#fde047">
          {[
            [30, 20],
            [90, 38],
            [150, 14],
            [210, 34],
            [260, 18],
            [60, 60],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" />
          ))}
        </g>
      )}
      <rect y="112" width="300" height="38" fill={ground} />
      {items.map((it, i) => (
        <svg key={i} x={it.x} y={it.y} width={it.s} height={it.s} viewBox="0 0 100 100">
          <IconShape name={it.icon} color={it.color} />
        </svg>
      ))}
    </svg>
  );
}

function StrokeRow({ strokes }: { strokes: string[] }) {
  return (
    <div className="flex items-center gap-2 rounded-3xl bg-white/80 p-3">
      {strokes.map((st, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="rounded-2xl border-4 border-orange-300 bg-orange-50 p-1">
            <Icon name={`stroke-${st}`} size={56} />
          </div>
          {i < strokes.length - 1 && <span className="text-2xl font-black text-orange-400">➜</span>}
        </div>
      ))}
    </div>
  );
}

export default function QuestionVisual({ q }: { q: Question }) {
  const cfg = q.imageConfig as Cfg;
  switch (q.imageType) {
    case "char":
      return <CharCard text={s(cfg.text)} color={s(cfg.color, "#ef4444")} />;
    case "radical":
      return <CharCard text={s(cfg.text)} tone="orange" label={s(cfg.label)} color="#ea580c" />;
    case "icon":
      return (
        <div className="rounded-3xl bg-white/80 p-3">
          <Icon name={s(cfg.name, "question")} color={cfg.color ? s(cfg.color) : undefined} size={n(cfg.size, 130)} className="animate-float" />
        </div>
      );
    case "count":
      return <CountGrid name={s(cfg.name, "apple")} count={n(cfg.count, 1)} color={cfg.color ? s(cfg.color) : undefined} />;
    case "stroke":
      if (Array.isArray(cfg.strokes)) return <StrokeRow strokes={cfg.strokes as string[]} />;
      return <CharCard text={s(cfg.text)} tone="orange" label={s(cfg.label)} color="#ea580c" />;
    case "structure":
      return <StructureDiagram kind={s(cfg.kind, "lr")} />;
    case "position":
      return <PositionDiagram rel={s(cfg.rel, "on")} obj={s(cfg.obj, "cat")} refIcon={s(cfg.ref, "tree")} />;
    case "scene":
      return <Scene cfg={cfg} />;
    default:
      return null;
  }
}
