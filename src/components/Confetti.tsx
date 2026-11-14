import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Illustration";

const COLORS = ["#ef4444", "#f59e0b", "#facc15", "#22c55e", "#38bdf8", "#8b5cf6", "#ec4899"];

// 星星爆開 + confetti。每次 burstKey 改變就播放一次（0 = 不播放）
export default function Confetti({ burstKey, big = false }: { burstKey: number; big?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!burstKey) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), big ? 3200 : 2200);
    return () => window.clearTimeout(t);
  }, [burstKey, big]);

  const pieces = useMemo(() => {
    const count = big ? 70 : 36;
    return Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 160,
      rot: 360 + Math.random() * 720,
      dur: 1.4 + Math.random() * 1.2,
      delay: Math.random() * 0.4,
      color: COLORS[i % COLORS.length],
      round: i % 3 === 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey, big]);

  const stars = useMemo(() => {
    const count = big ? 12 : 8;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 90 + Math.random() * 70;
      return { sx: Math.cos(angle) * dist, sy: Math.sin(angle) * dist, delay: Math.random() * 0.1, size: 26 + Math.random() * 16 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey, big]);

  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={`c${i}`}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            borderRadius: p.round ? "50%" : undefined,
            ["--dx" as string]: `${p.dx}px`,
            ["--rot" as string]: `${p.rot}deg`,
            ["--dur" as string]: `${p.dur}s`,
            ["--delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
      {stars.map((st, i) => (
        <span
          key={`s${i}`}
          className="star-piece"
          style={{ ["--sx" as string]: `${st.sx}px`, ["--sy" as string]: `${st.sy}px`, ["--delay" as string]: `${st.delay}s` }}
        >
          <Icon name="star" size={st.size} />
        </span>
      ))}
    </div>
  );
}
