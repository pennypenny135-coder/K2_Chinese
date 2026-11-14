export type Mood = "idle" | "happy" | "try" | "cheer";

// 中文熊貓 / Chinese Panda — 內建 SVG 吉祥物
export default function CharacterMascot({ mood = "idle", size = 120, animKey = 0 }: { mood?: Mood; size?: number; animKey?: number }) {
  const anim =
    mood === "happy" || mood === "cheer" ? "animate-panda-jump" : mood === "try" ? "animate-panda-shake" : "animate-bob";
  const ink = "#2b2b3a";
  const up = mood === "cheer" || mood === "happy";
  return (
    <svg key={animKey} viewBox="0 0 120 134" width={size} height={size * (134 / 120)} className={anim} role="img" aria-label="中文熊貓 Chinese Panda">
      {/* 竹子 */}
      {mood === "idle" && (
        <g>
          <rect x="100" y="70" width="6" height="52" rx="3" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
          <path d="M106 86C116 80 118 74 118 72C110 72 106 78 106 86Z" fill="#22c55e" />
        </g>
      )}
      {/* 腳 */}
      <ellipse cx="38" cy="116" rx="16" ry="11" fill={ink} />
      <ellipse cx="82" cy="116" rx="16" ry="11" fill={ink} />
      {/* 身體 */}
      <ellipse cx="60" cy="92" rx="35" ry="30" fill="#fff" stroke={ink} strokeWidth="3" />
      <ellipse cx="60" cy="96" rx="20" ry="18" fill="#f1f5f9" />
      {/* 手 */}
      {up ? (
        <>
          <ellipse cx="24" cy="70" rx="9" ry="17" fill={ink} transform="rotate(35 24 70)" />
          <ellipse cx="96" cy="70" rx="9" ry="17" fill={ink} transform="rotate(-35 96 70)" />
        </>
      ) : (
        <>
          <ellipse cx="27" cy="92" rx="9" ry="17" fill={ink} transform="rotate(14 27 92)" />
          <ellipse cx="93" cy="92" rx="9" ry="17" fill={ink} transform="rotate(-14 93 92)" />
        </>
      )}
      {/* 耳仔 */}
      <circle cx="28" cy="22" r="13" fill={ink} />
      <circle cx="92" cy="22" r="13" fill={ink} />
      <circle cx="28" cy="22" r="6" fill="#64748b" />
      <circle cx="92" cy="22" r="6" fill="#64748b" />
      {/* 頭 */}
      <ellipse cx="60" cy="48" rx="40" ry="34" fill="#fff" stroke={ink} strokeWidth="3" />
      {/* 眼圈 */}
      <ellipse cx="42" cy="48" rx="10" ry="13" fill={ink} transform="rotate(22 42 48)" />
      <ellipse cx="78" cy="48" rx="10" ry="13" fill={ink} transform="rotate(-22 78 48)" />
      {/* 眼睛 */}
      {mood === "happy" || mood === "cheer" ? (
        <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
          <path d="M37 49Q43 41 49 49" />
          <path d="M71 49Q77 41 83 49" />
        </g>
      ) : (
        <g>
          <circle cx="43" cy="47" r="5" fill="#fff" />
          <circle cx="77" cy="47" r="5" fill="#fff" />
          <circle cx="44" cy="48" r="2.8" fill={ink} />
          <circle cx="76" cy="48" r="2.8" fill={ink} />
        </g>
      )}
      {mood === "try" && (
        <g stroke={ink} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M33 32Q42 28 48 33" />
          <path d="M72 33Q78 28 87 32" />
        </g>
      )}
      {/* 面珠 */}
      <circle cx="30" cy="62" r="6" fill="#fda4af" opacity=".75" />
      <circle cx="90" cy="62" r="6" fill="#fda4af" opacity=".75" />
      {/* 鼻同口 */}
      <ellipse cx="60" cy="58" rx="6" ry="4" fill={ink} />
      {mood === "happy" || mood === "cheer" ? (
        <path d="M49 65Q60 82 71 65Z" fill="#fb7185" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      ) : mood === "try" ? (
        <path d="M53 68Q60 72 67 68" fill="none" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
      ) : (
        <path d="M52 65Q60 73 68 65" fill="none" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
      )}
      {up && (
        <g fill="#fde047" stroke="#f59e0b" strokeWidth="1">
          <polygon points="12,28 14.5,34 21,34 16,38 18,44 12,40 6,44 8,38 3,34 9.5,34" />
          <polygon points="108,24 110,29 115,29 111,32 112.5,37 108,34 103.5,37 105,32 101,29 106,29" />
        </g>
      )}
    </svg>
  );
}
