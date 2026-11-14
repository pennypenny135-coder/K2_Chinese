import type { ReactNode } from "react";

// 全部圖形都係內建 SVG（viewBox 0 0 100 100），冇用外部圖片
const O = "#5b3a29"; // 線條顏色
const SW = 3;
const SKIN = "#fcd9b6";

type Shape = (c?: string) => ReactNode;

const blob = (circles: [number, number, number][], fill: string) => (
  <g>
    <g fill={O} stroke={O} strokeWidth={6}>
      {circles.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
    <g fill={fill}>
      {circles.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  </g>
);

interface PersonOpts {
  hair: string;
  shirt: string;
  scale: number;
  long?: boolean;
  tails?: boolean;
  skirt?: boolean;
  glasses?: boolean;
}
const person = (o: PersonOpts) => (
  <g transform={`translate(50 96) scale(${o.scale}) translate(-50 -96)`}>
    {o.long && <rect x="28" y="20" width="44" height="46" rx="16" fill={o.hair} stroke={O} strokeWidth={SW} />}
    <rect x="38" y="88" width="9" height="9" rx="3" fill="#475569" />
    <rect x="53" y="88" width="9" height="9" rx="3" fill="#475569" />
    {o.skirt ? (
      <path d="M38 50H62L72 92H28Z" fill={o.shirt} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    ) : (
      <rect x="30" y="50" width="40" height="40" rx="12" fill={o.shirt} stroke={O} strokeWidth={SW} />
    )}
    {o.tails && (
      <g fill={o.hair} stroke={O} strokeWidth={SW}>
        <circle cx="27" cy="34" r="8" />
        <circle cx="73" cy="34" r="8" />
      </g>
    )}
    <circle cx="50" cy="34" r="19" fill={SKIN} stroke={O} strokeWidth={SW} />
    <path d="M31 32C30 12 70 12 69 32C62 24 38 24 31 32Z" fill={o.hair} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
    <circle cx="43" cy="37" r="2.6" fill={O} />
    <circle cx="57" cy="37" r="2.6" fill={O} />
    <circle cx="38" cy="43" r="3" fill="#fda4af" opacity=".7" />
    <circle cx="62" cy="43" r="3" fill="#fda4af" opacity=".7" />
    <path d="M45 44Q50 49 55 44" fill="none" stroke={O} strokeWidth={2.2} strokeLinecap="round" />
    {o.glasses && (
      <g fill="none" stroke={O} strokeWidth={2}>
        <circle cx="43" cy="37" r="6" />
        <circle cx="57" cy="37" r="6" />
        <path d="M49 37H51" />
      </g>
    )}
  </g>
);

const shoe = (dx: number, c: string) => (
  <g transform={`translate(${dx} 0)`}>
    <path d="M6 72V46C6 42 10 40 14 42L24 48C32 52 42 52 46 60C48 64 48 68 48 72Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="4" y="70" width="46" height="9" rx="4" fill="#fff" stroke={O} strokeWidth={SW} />
    <path d="M22 52L28 46M30 56L36 50" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
  </g>
);
const sock = (dx: number, c: string) => (
  <g transform={`translate(${dx} 0)`}>
    <path d="M12 12H36V52L50 70C56 80 48 90 38 88L20 78C12 72 12 60 12 54Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="12" y="12" width="24" height="10" fill="#fff" stroke={O} strokeWidth={2.5} />
    <path d="M12 30H36" stroke="#fff" strokeWidth={4} />
  </g>
);
const mitten = (dx: number, c: string) => (
  <g transform={`translate(${dx} 0)`}>
    <ellipse cx="40" cy="48" rx="8" ry="12" fill={c} stroke={O} strokeWidth={SW} transform="rotate(-25 40 48)" />
    <path d="M10 66V34C10 14 38 14 38 34V66Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <rect x="8" y="64" width="32" height="16" rx="4" fill="#fff" stroke={O} strokeWidth={SW} />
  </g>
);

const cloudShape = (c: string, dy = 0) => (
  <g transform={`translate(0 ${dy})`}>{blob([[30, 62, 16], [52, 48, 22], [72, 60, 18], [50, 68, 14]], c)}</g>
);

const SHAPES: Record<string, Shape> = {
  question: () => (
    <g>
      <circle cx="50" cy="50" r="38" fill="#e0f2fe" stroke={O} strokeWidth={SW} />
      <text x="50" y="68" textAnchor="middle" fontSize="54" fontWeight="800" fill="#0ea5e9">?</text>
    </g>
  ),
  charcard: () => (
    <g>
      <rect x="12" y="12" width="76" height="76" rx="14" fill="#fff" stroke={O} strokeWidth={SW} />
      <path d="M50 12V88M12 50H88" stroke="#fca5a5" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="800" fill="#ef4444">字</text>
    </g>
  ),
  // ---- 水果與食物 ----
  apple: (c = "#ef4444") => (
    <g>
      <path d="M50 30C36 20 12 30 14 56C16 80 34 92 50 86C66 92 84 80 86 56C88 30 64 20 50 30Z" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M50 30C50 22 52 16 56 10" fill="none" stroke={O} strokeWidth={4} strokeLinecap="round" />
      <path d="M56 24C60 12 74 12 78 16C74 26 64 28 56 24Z" fill="#4ade80" stroke={O} strokeWidth={2.5} />
      <ellipse cx="30" cy="50" rx="5" ry="9" fill="#fff" opacity=".45" transform="rotate(15 30 50)" />
    </g>
  ),
  banana: (c = "#facc15") => (
    <g>
      <path d="M20 28C22 66 50 90 86 72C92 69 90 62 84 63C58 70 40 56 36 26C35 20 21 20 20 28Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="20" y="14" width="14" height="11" rx="3" fill="#92400e" stroke={O} strokeWidth={2.5} />
      <path d="M29 40C33 58 47 70 66 70" fill="none" stroke="#fff" opacity=".45" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  orange: (c = "#fb923c") => (
    <g>
      <circle cx="50" cy="55" r="36" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M50 20C52 14 58 10 64 12C62 20 56 24 50 20Z" fill="#4ade80" stroke={O} strokeWidth={2.5} />
      <ellipse cx="34" cy="44" rx="6" ry="10" fill="#fff" opacity=".4" transform="rotate(20 34 44)" />
      <g fill="#ea580c" opacity=".5">
        <circle cx="56" cy="62" r="1.8" />
        <circle cx="68" cy="52" r="1.8" />
        <circle cx="46" cy="72" r="1.8" />
        <circle cx="62" cy="76" r="1.8" />
      </g>
    </g>
  ),
  grape: (c = "#8b5cf6") => (
    <g>
      <path d="M50 28C50 20 54 14 60 10" fill="none" stroke="#92400e" strokeWidth={4} strokeLinecap="round" />
      <path d="M52 20C60 10 74 12 76 18C70 26 60 26 52 20Z" fill="#4ade80" stroke={O} strokeWidth={2.5} />
      {blob([[34, 40, 12], [50, 38, 12], [66, 40, 12], [42, 56, 12], [58, 56, 12], [50, 72, 12]], c)}
      <g fill="#fff" opacity=".45">
        <circle cx="30" cy="36" r="3" />
        <circle cx="46" cy="34" r="3" />
        <circle cx="62" cy="36" r="3" />
      </g>
    </g>
  ),
  watermelon: () => (
    <g>
      <path d="M8 36A42 42 0 0 0 92 36Z" fill="#22c55e" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M15 36A35 35 0 0 0 85 36Z" fill="#ef4444" />
      <path d="M15 36A35 35 0 0 0 85 36" fill="none" stroke="#f0fdf4" strokeWidth={3} />
      <g fill="#1f2937">
        <ellipse cx="34" cy="48" rx="2.5" ry="4" />
        <ellipse cx="50" cy="56" rx="2.5" ry="4" />
        <ellipse cx="66" cy="48" rx="2.5" ry="4" />
        <ellipse cx="42" cy="66" rx="2.5" ry="4" />
        <ellipse cx="58" cy="66" rx="2.5" ry="4" />
      </g>
    </g>
  ),
  milk: () => (
    <g>
      <path d="M28 34L40 14H60L72 34V88H28Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M28 34H72" stroke={O} strokeWidth={SW} />
      <rect x="28" y="48" width="44" height="28" fill="#60a5fa" stroke={O} strokeWidth={SW} />
      <path d="M50 54C50 54 42 62 42 66C42 70 46 72 50 72C54 72 58 70 58 66C58 62 50 54 50 54Z" fill="#fff" />
    </g>
  ),
  bread: () => (
    <g>
      <path d="M14 56C10 34 30 22 50 22C70 22 90 34 86 56C86 74 84 84 76 84H24C16 84 14 74 14 56Z" fill="#fbbf24" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M36 32L30 50M52 30L46 48M68 32L62 50" fill="none" stroke="#b45309" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  egg: () => (
    <g>
      <path d="M20 50C14 30 36 16 52 20C72 14 90 32 82 52C90 72 64 86 48 80C28 88 8 72 20 50Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="52" cy="50" r="17" fill="#fbbf24" stroke="#d97706" strokeWidth={2} />
      <ellipse cx="46" cy="44" rx="4" ry="6" fill="#fff" opacity=".6" />
    </g>
  ),
  rice: () => (
    <g>
      <path d="M16 52C18 28 40 20 50 20C60 20 82 28 84 52Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M12 52H88C88 76 72 90 50 90C28 90 12 76 12 52Z" fill="#3b82f6" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M62 8L84 40M70 6L90 34" stroke="#b45309" strokeWidth={4} strokeLinecap="round" />
      <path d="M36 36L40 40M52 30L56 34M62 40L66 44" stroke="#cbd5e1" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  water: () => (
    <g>
      <path d="M26 20H74L68 88H32Z" fill="#e0f2fe" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M29.5 40H70.5L67 86H33Z" fill="#38bdf8" />
      <circle cx="44" cy="62" r="3" fill="#fff" opacity=".7" />
      <circle cx="56" cy="72" r="2.5" fill="#fff" opacity=".7" />
    </g>
  ),
  cake: (c = "#f9a8d4") => (
    <g>
      <rect x="14" y="58" width="72" height="30" rx="6" fill={c} stroke={O} strokeWidth={SW} />
      <rect x="26" y="40" width="48" height="20" rx="5" fill="#fef3c7" stroke={O} strokeWidth={SW} />
      <path d="M14 66Q22 74 30 66T46 66T62 66T78 66T86 66" fill="none" stroke="#fff" strokeWidth={4} />
      <rect x="47" y="22" width="6" height="18" rx="2" fill="#38bdf8" stroke={O} strokeWidth={2} />
      <path d="M50 8C56 14 56 20 50 22C44 20 44 14 50 8Z" fill="#fbbf24" stroke="#ea580c" strokeWidth={2} />
    </g>
  ),
  // ---- 動物 ----
  cat: (c = "#f59e0b") => (
    <g>
      <path d="M14 48L18 10L46 28Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M86 48L82 10L54 28Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M22 36L24 20L36 28Z" fill="#fbcfe8" />
      <path d="M78 36L76 20L64 28Z" fill="#fbcfe8" />
      <ellipse cx="50" cy="58" rx="38" ry="32" fill={c} stroke={O} strokeWidth={SW} />
      <ellipse cx="35" cy="54" rx="6.5" ry="8" fill="#fff" />
      <ellipse cx="65" cy="54" rx="6.5" ry="8" fill="#fff" />
      <circle cx="36" cy="55" r="4.2" fill="#1f2937" />
      <circle cx="64" cy="55" r="4.2" fill="#1f2937" />
      <path d="M45 64H55L50 70Z" fill="#f472b6" />
      <path d="M50 70Q44 78 38 73M50 70Q56 78 62 73" fill="none" stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />
      <path d="M8 64L28 66M8 74L28 71M92 64L72 66M92 74L72 71" stroke="#1f2937" strokeWidth={1.8} strokeLinecap="round" />
    </g>
  ),
  dog: (c = "#d4a373") => (
    <g>
      <ellipse cx="18" cy="52" rx="13" ry="26" fill="#8b5e3c" stroke={O} strokeWidth={SW} transform="rotate(12 18 52)" />
      <ellipse cx="82" cy="52" rx="13" ry="26" fill="#8b5e3c" stroke={O} strokeWidth={SW} transform="rotate(-12 82 52)" />
      <ellipse cx="50" cy="52" rx="33" ry="34" fill={c} stroke={O} strokeWidth={SW} />
      <ellipse cx="50" cy="68" rx="20" ry="15" fill="#fff7ed" stroke={O} strokeWidth={2} />
      <circle cx="37" cy="46" r="5" fill="#1f2937" />
      <circle cx="63" cy="46" r="5" fill="#1f2937" />
      <circle cx="38.5" cy="44.5" r="1.6" fill="#fff" />
      <circle cx="64.5" cy="44.5" r="1.6" fill="#fff" />
      <ellipse cx="50" cy="60" rx="7" ry="5" fill="#1f2937" />
      <path d="M50 65V70M50 70Q44 76 40 72M50 70Q56 76 60 72" fill="none" stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />
      <path d="M45 74Q50 86 55 74Z" fill="#fb7185" />
    </g>
  ),
  bird: (c = "#38bdf8") => (
    <g>
      <path d="M22 54L4 40L8 66Z" fill="#0ea5e9" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="50" cy="56" rx="32" ry="28" fill={c} stroke={O} strokeWidth={SW} />
      <ellipse cx="54" cy="66" rx="18" ry="14" fill="#e0f2fe" />
      <path d="M32 54C40 40 56 44 58 60C46 64 36 62 32 54Z" fill="#0ea5e9" stroke={O} strokeWidth={2.5} />
      <path d="M80 48L98 54L80 60Z" fill="#fb923c" stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx="70" cy="46" r="5" fill="#fff" stroke={O} strokeWidth={1.5} />
      <circle cx="71" cy="46" r="2.6" fill="#1f2937" />
      <path d="M44 84V92M56 84V92" stroke="#f59e0b" strokeWidth={3.5} strokeLinecap="round" />
    </g>
  ),
  fish: (c = "#fb923c") => (
    <g>
      <path d="M70 50L96 28V72Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M40 28L52 14L62 30Z" fill={c} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx="44" cy="52" rx="36" ry="26" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M48 36C56 44 56 60 48 68M60 38C66 46 66 58 60 66" fill="none" stroke="#fff" opacity=".55" strokeWidth={3} strokeLinecap="round" />
      <circle cx="24" cy="46" r="6" fill="#fff" stroke={O} strokeWidth={1.5} />
      <circle cx="23" cy="46" r="3" fill="#1f2937" />
      <path d="M12 58Q17 62 22 58" fill="none" stroke={O} strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  rabbit: (c = "#ffffff") => (
    <g>
      <ellipse cx="36" cy="26" rx="10" ry="23" fill={c} stroke={O} strokeWidth={SW} transform="rotate(-8 36 26)" />
      <ellipse cx="64" cy="26" rx="10" ry="23" fill={c} stroke={O} strokeWidth={SW} transform="rotate(8 64 26)" />
      <ellipse cx="36" cy="28" rx="4.5" ry="15" fill="#fbcfe8" transform="rotate(-8 36 28)" />
      <ellipse cx="64" cy="28" rx="4.5" ry="15" fill="#fbcfe8" transform="rotate(8 64 28)" />
      <ellipse cx="50" cy="66" rx="32" ry="27" fill={c} stroke={O} strokeWidth={SW} />
      <circle cx="39" cy="62" r="4.5" fill="#1f2937" />
      <circle cx="61" cy="62" r="4.5" fill="#1f2937" />
      <circle cx="40.5" cy="60.5" r="1.5" fill="#fff" />
      <circle cx="62.5" cy="60.5" r="1.5" fill="#fff" />
      <path d="M46 70H54L50 75Z" fill="#f472b6" />
      <path d="M50 75Q45 81 40 77M50 75Q55 81 60 77" fill="none" stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />
      <circle cx="30" cy="72" r="4.5" fill="#fda4af" opacity=".6" />
      <circle cx="70" cy="72" r="4.5" fill="#fda4af" opacity=".6" />
    </g>
  ),
  elephant: (c = "#94a3b8") => (
    <g>
      <circle cx="18" cy="46" r="20" fill="#cbd5e1" stroke={O} strokeWidth={SW} />
      <circle cx="82" cy="46" r="20" fill="#cbd5e1" stroke={O} strokeWidth={SW} />
      <circle cx="50" cy="44" r="30" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M50 54C50 82 74 88 74 70" fill="none" stroke={O} strokeWidth={18} strokeLinecap="round" />
      <path d="M50 54C50 82 74 88 74 70" fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" />
      <circle cx="38" cy="40" r="4" fill="#1f2937" />
      <circle cx="62" cy="40" r="4" fill="#1f2937" />
      <path d="M36 62L28 78M64 62L72 78" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity=".0" />
    </g>
  ),
  lion: (c = "#fcd34d") => (
    <g>
      <g fill="#d97706" stroke={O} strokeWidth={SW}>
        <circle cx="50" cy="52" r="40" />
      </g>
      <g fill="#b45309" stroke={O} strokeWidth={2}>
        <circle cx="22" cy="24" r="9" />
        <circle cx="78" cy="24" r="9" />
      </g>
      <circle cx="50" cy="54" r="28" fill={c} stroke={O} strokeWidth={SW} />
      <circle cx="40" cy="48" r="4" fill="#1f2937" />
      <circle cx="60" cy="48" r="4" fill="#1f2937" />
      <ellipse cx="50" cy="62" rx="12" ry="9" fill="#fef3c7" />
      <path d="M45 58H55L50 64Z" fill="#7c2d12" />
      <path d="M50 64Q44 71 39 67M50 64Q56 71 61 67" fill="none" stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  monkey: (c = "#a16207") => (
    <g>
      <circle cx="14" cy="52" r="13" fill={c} stroke={O} strokeWidth={SW} />
      <circle cx="86" cy="52" r="13" fill={c} stroke={O} strokeWidth={SW} />
      <circle cx="14" cy="52" r="6" fill="#fde7c3" />
      <circle cx="86" cy="52" r="6" fill="#fde7c3" />
      <circle cx="50" cy="48" r="34" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M50 40C40 30 24 40 28 56C30 74 40 84 50 84C60 84 70 74 72 56C76 40 60 30 50 40Z" fill="#fde7c3" />
      <circle cx="40" cy="52" r="4" fill="#1f2937" />
      <circle cx="60" cy="52" r="4" fill="#1f2937" />
      <ellipse cx="46" cy="66" rx="1.8" ry="2.5" fill="#7c2d12" />
      <ellipse cx="54" cy="66" rx="1.8" ry="2.5" fill="#7c2d12" />
      <path d="M40 73Q50 80 60 73" fill="none" stroke="#1f2937" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  ),
  cow: () => (
    <g>
      <path d="M26 24L18 8M74 24L82 8" stroke={O} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx="12" cy="42" rx="12" ry="8" fill="#fff" stroke={O} strokeWidth={SW} transform="rotate(20 12 42)" />
      <ellipse cx="88" cy="42" rx="12" ry="8" fill="#fff" stroke={O} strokeWidth={SW} transform="rotate(-20 88 42)" />
      <ellipse cx="50" cy="52" rx="32" ry="34" fill="#fff" stroke={O} strokeWidth={SW} />
      <path d="M26 36C26 24 42 22 46 32C44 44 32 48 26 36Z" fill="#334155" />
      <circle cx="38" cy="52" r="4" fill="#1f2937" />
      <circle cx="62" cy="52" r="4" fill="#1f2937" />
      <ellipse cx="50" cy="75" rx="21" ry="14" fill="#fbcfe8" stroke={O} strokeWidth={SW} />
      <ellipse cx="42" cy="75" rx="3" ry="4" fill="#be185d" />
      <ellipse cx="58" cy="75" rx="3" ry="4" fill="#be185d" />
    </g>
  ),
  pig: () => (
    <g>
      <path d="M18 30L30 14L40 30Z" fill="#f472b6" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M82 30L70 14L60 30Z" fill="#f472b6" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="50" cy="56" rx="38" ry="34" fill="#f9a8d4" stroke={O} strokeWidth={SW} />
      <circle cx="35" cy="46" r="4.5" fill="#1f2937" />
      <circle cx="65" cy="46" r="4.5" fill="#1f2937" />
      <ellipse cx="50" cy="64" rx="17" ry="12" fill="#f472b6" stroke={O} strokeWidth={SW} />
      <ellipse cx="44" cy="64" rx="3" ry="4.5" fill="#9d174d" />
      <ellipse cx="56" cy="64" rx="3" ry="4.5" fill="#9d174d" />
    </g>
  ),
  butterfly: (c = "#a78bfa") => (
    <g>
      <path d="M46 40C34 8 6 16 10 40C12 52 32 56 46 48Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M54 40C66 8 94 16 90 40C88 52 68 56 54 48Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M46 52C30 54 16 66 28 80C38 88 48 74 46 52Z" fill="#f9a8d4" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M54 52C70 54 84 66 72 80C62 88 52 74 54 52Z" fill="#f9a8d4" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="50" cy="52" rx="5" ry="26" fill="#334155" stroke={O} strokeWidth={2} />
      <path d="M48 28C44 18 40 14 36 12M52 28C56 18 60 14 64 12" fill="none" stroke={O} strokeWidth={2.5} strokeLinecap="round" />
      <g fill="#fff" opacity=".7">
        <circle cx="26" cy="34" r="5" />
        <circle cx="74" cy="34" r="5" />
      </g>
    </g>
  ),
  // ---- 大自然與天氣 ----
  sun: (c = "#fbbf24") => (
    <g>
      <g stroke="#f59e0b" strokeWidth={6} strokeLinecap="round">
        <path d="M50 6V16M50 84V94M6 50H16M84 50H94M19 19L26 26M74 74L81 81M81 19L74 26M26 74L19 81" />
      </g>
      <circle cx="50" cy="50" r="25" fill={c} stroke={O} strokeWidth={SW} />
      <circle cx="42" cy="46" r="3" fill={O} />
      <circle cx="58" cy="46" r="3" fill={O} />
      <path d="M41 56Q50 65 59 56" fill="none" stroke={O} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  ),
  moon: (c = "#fde047") => (
    <g>
      <defs>
        <mask id="moonmask">
          <rect width="100" height="100" fill="#fff" />
          <circle cx="68" cy="38" r="30" fill="#000" />
        </mask>
      </defs>
      <circle cx="46" cy="54" r="38" fill={c} mask="url(#moonmask)" />
      <path d="M76 70L78 76L84 78L78 80L76 86L74 80L68 78L74 76Z" fill="#fde047" />
      <circle cx="30" cy="62" r="4" fill="#facc15" />
      <circle cx="38" cy="78" r="3" fill="#facc15" />
    </g>
  ),
  star: (c = "#fbbf24") => (
    <g>
      <polygon points="50,8 61,38 93,38 67,57 77,89 50,70 23,89 33,57 7,38 39,38" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="43" cy="42" r="3" fill="#fff" opacity=".6" />
    </g>
  ),
  cloud: (c = "#ffffff") => <g>{cloudShape(c, -4)}</g>,
  rain: () => (
    <g>
      {cloudShape("#cbd5e1", -12)}
      <g fill="#38bdf8" stroke="#0284c7" strokeWidth={1.5}>
        <path d="M30 70C30 70 24 78 24 82C24 86 27 88 30 88C33 88 36 86 36 82C36 78 30 70 30 70Z" />
        <path d="M52 74C52 74 46 82 46 86C46 90 49 92 52 92C55 92 58 90 58 86C58 82 52 74 52 74Z" />
        <path d="M74 70C74 70 68 78 68 82C68 86 71 88 74 88C77 88 80 86 80 82C80 78 74 70 74 70Z" />
      </g>
    </g>
  ),
  wind: (c = "#38bdf8") => (
    <g fill="none" stroke={c} strokeWidth={6} strokeLinecap="round">
      <path d="M8 34H62C80 34 82 14 66 16" />
      <path d="M8 52H80C98 52 98 74 82 72" />
      <path d="M20 70H48C60 70 62 86 52 86" />
    </g>
  ),
  mountain: (c = "#34d399") => (
    <g>
      <path d="M2 88L36 28L60 66L72 46L98 88Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M36 28L26 46L36 42L46 48Z" fill="#fff" stroke={O} strokeWidth={2} strokeLinejoin="round" />
    </g>
  ),
  tree: (c = "#22c55e") => (
    <g>
      <rect x="42" y="56" width="16" height="36" rx="3" fill="#a16207" stroke={O} strokeWidth={SW} />
      {blob([[50, 34, 24], [30, 52, 18], [70, 52, 18]], c)}
      <circle cx="42" cy="28" r="4" fill="#fff" opacity=".3" />
    </g>
  ),
  flower: (c = "#f472b6") => (
    <g>
      <path d="M50 46V92" stroke="#16a34a" strokeWidth={5} strokeLinecap="round" />
      <path d="M50 76C40 64 28 70 30 76C36 82 46 80 50 76Z" fill="#4ade80" stroke={O} strokeWidth={2} />
      <path d="M50 70C60 58 72 64 70 70C64 76 54 74 50 70Z" fill="#4ade80" stroke={O} strokeWidth={2} />
      <g fill={c} stroke={O} strokeWidth={2.5}>
        <circle cx="50" cy="16" r="12" />
        <circle cx="66" cy="28" r="12" />
        <circle cx="60" cy="46" r="12" />
        <circle cx="40" cy="46" r="12" />
        <circle cx="34" cy="28" r="12" />
      </g>
      <circle cx="50" cy="32" r="10" fill="#fde047" stroke={O} strokeWidth={2.5} />
    </g>
  ),
  fire: () => (
    <g>
      <path d="M50 8C54 28 78 40 74 66C72 82 60 92 50 92C38 92 26 82 26 66C26 52 36 46 40 34C46 38 46 20 50 8Z" fill="#f97316" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M50 48C54 58 62 62 60 74C59 82 54 86 50 86C44 86 40 80 40 74C40 64 48 60 50 48Z" fill="#fde047" />
    </g>
  ),
  drop: (c = "#38bdf8") => (
    <g>
      <path d="M50 8C50 8 20 44 20 62C20 80 34 92 50 92C66 92 80 80 80 62C80 44 50 8 50 8Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="38" cy="64" rx="5" ry="9" fill="#fff" opacity=".5" transform="rotate(15 38 64)" />
    </g>
  ),
  heart: (c = "#ef4444") => (
    <g>
      <path d="M50 88C20 66 8 46 16 30C24 16 44 18 50 34C56 18 76 16 84 30C92 46 80 66 50 88Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="30" cy="38" rx="5" ry="8" fill="#fff" opacity=".45" transform="rotate(30 30 38)" />
    </g>
  ),
  // ---- 身體部位 ----
  head: () => (
    <g>
      <circle cx="14" cy="56" r="8" fill={SKIN} stroke={O} strokeWidth={SW} />
      <circle cx="86" cy="56" r="8" fill={SKIN} stroke={O} strokeWidth={SW} />
      <circle cx="50" cy="52" r="36" fill={SKIN} stroke={O} strokeWidth={SW} />
      <path d="M14 48C12 12 88 12 86 48C76 30 62 26 50 28C38 26 24 30 14 48Z" fill="#3f2a1d" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="37" cy="58" r="4" fill={O} />
      <circle cx="63" cy="58" r="4" fill={O} />
      <circle cx="28" cy="68" r="5" fill="#fda4af" opacity=".7" />
      <circle cx="72" cy="68" r="5" fill="#fda4af" opacity=".7" />
      <path d="M40 72Q50 82 60 72" fill="none" stroke={O} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  eye: () => (
    <g>
      <path d="M6 52C24 20 76 20 94 52C76 82 24 82 6 52Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="50" cy="52" r="19" fill="#60a5fa" stroke={O} strokeWidth={2.5} />
      <circle cx="50" cy="52" r="9" fill="#1f2937" />
      <circle cx="44" cy="46" r="4" fill="#fff" />
      <path d="M18 34L12 26M34 26L30 16M50 22V12M66 26L70 16M82 34L88 26" stroke={O} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  ear: () => (
    <g>
      <path d="M54 10C28 6 20 36 32 52C38 62 36 72 44 84C52 96 74 88 70 72C68 62 80 56 80 40C80 22 70 12 54 10Z" fill={SKIN} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M56 26C42 24 38 40 46 48C52 54 52 62 56 68" fill="none" stroke="#e0a67c" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  nose: () => (
    <g>
      <path d="M50 10C46 38 34 54 28 66C22 80 36 90 50 84C64 90 78 80 72 66C66 54 54 38 50 10Z" fill={SKIN} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="40" cy="76" rx="4.5" ry="6" fill="#b45309" />
      <ellipse cx="60" cy="76" rx="4.5" ry="6" fill="#b45309" />
    </g>
  ),
  mouth: () => (
    <g>
      <path d="M8 50C28 28 42 36 50 40C58 36 72 28 92 50C72 80 28 80 8 50Z" fill="#f43f5e" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M22 52C40 60 60 60 78 52C66 70 34 70 22 52Z" fill="#fff" />
      <path d="M10 50C36 56 64 56 90 50" fill="none" stroke={O} strokeWidth={2.5} />
    </g>
  ),
  hand: () => (
    <g fill={SKIN} stroke={O} strokeWidth={SW} strokeLinejoin="round">
      <rect x="26" y="22" width="11" height="38" rx="5.5" />
      <rect x="38" y="10" width="11" height="48" rx="5.5" />
      <rect x="50" y="14" width="11" height="44" rx="5.5" />
      <rect x="62" y="24" width="11" height="36" rx="5.5" />
      <rect x="10" y="52" width="12" height="30" rx="6" transform="rotate(-30 16 66)" />
      <rect x="22" y="46" width="52" height="44" rx="18" />
    </g>
  ),
  foot: () => (
    <g fill={SKIN} stroke={O} strokeWidth={SW}>
      <path d="M52 42C74 42 80 62 72 80C66 94 40 96 34 82C28 66 34 42 52 42Z" />
      <circle cx="28" cy="34" r="6" />
      <circle cx="40" cy="26" r="6.5" />
      <circle cx="54" cy="24" r="6" />
      <circle cx="66" cy="29" r="5.5" />
      <circle cx="76" cy="38" r="5" />
    </g>
  ),
  // ---- 交通 ----
  car: (c = "#ef4444") => (
    <g>
      <rect x="6" y="50" width="88" height="26" rx="9" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M22 50L34 28H66L80 50Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M29 48L38 32H48V48Z" fill="#bae6fd" />
      <path d="M52 48V32H62L72 48Z" fill="#bae6fd" />
      <circle cx="28" cy="76" r="11" fill="#374151" stroke={O} strokeWidth={SW} />
      <circle cx="72" cy="76" r="11" fill="#374151" stroke={O} strokeWidth={SW} />
      <circle cx="28" cy="76" r="4" fill="#e5e7eb" />
      <circle cx="72" cy="76" r="4" fill="#e5e7eb" />
      <rect x="86" y="56" width="7" height="7" rx="2" fill="#fde047" />
    </g>
  ),
  bus: (c = "#facc15") => (
    <g>
      <rect x="6" y="20" width="88" height="56" rx="10" fill={c} stroke={O} strokeWidth={SW} />
      <g fill="#bae6fd" stroke={O} strokeWidth={2}>
        <rect x="12" y="28" width="16" height="16" rx="3" />
        <rect x="32" y="28" width="16" height="16" rx="3" />
        <rect x="52" y="28" width="16" height="16" rx="3" />
        <rect x="74" y="28" width="14" height="30" rx="3" />
      </g>
      <rect x="6" y="56" width="88" height="6" fill="#ef4444" />
      <circle cx="26" cy="78" r="10" fill="#374151" stroke={O} strokeWidth={SW} />
      <circle cx="74" cy="78" r="10" fill="#374151" stroke={O} strokeWidth={SW} />
      <circle cx="26" cy="78" r="4" fill="#e5e7eb" />
      <circle cx="74" cy="78" r="4" fill="#e5e7eb" />
    </g>
  ),
  bike: (c = "#ef4444") => (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="66" r="18" stroke="#374151" strokeWidth={5} />
      <circle cx="78" cy="66" r="18" stroke="#374151" strokeWidth={5} />
      <path d="M24 66L40 36L64 36L78 66M40 36L52 66L24 66M52 66L64 36" stroke={c} strokeWidth={5} />
      <path d="M32 30H46M60 26L70 28M64 36L66 26" stroke={O} strokeWidth={5} />
    </g>
  ),
  plane: (c = "#3b82f6") => (
    <g>
      <path d="M52 44L68 20H78L70 44Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M8 52C8 44 20 42 40 42H80C92 42 96 48 96 52C96 56 92 62 80 62H28C16 62 8 60 8 52Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M10 46L4 24H20L32 42Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M44 56L62 84H74L68 56Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <g fill="#bae6fd" stroke={O} strokeWidth={1.5}>
        <circle cx="42" cy="50" r="3.5" />
        <circle cx="54" cy="50" r="3.5" />
        <circle cx="66" cy="50" r="3.5" />
        <path d="M82 44H90C92 46 93 48 93 50H82Z" />
      </g>
    </g>
  ),
  boat: (c = "#ef4444") => (
    <g>
      <path d="M50 14V62" stroke={O} strokeWidth={4} strokeLinecap="round" />
      <path d="M50 16V56H20Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M54 26V56H82Z" fill="#fde047" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M8 62H92L80 84H20Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M4 92Q14 86 24 92T44 92T64 92T84 92T98 90" fill="none" stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  train: (c = "#3b82f6") => (
    <g>
      <rect x="16" y="20" width="10" height="20" fill="#374151" stroke={O} strokeWidth={2.5} />
      <g fill="#fff" stroke={O} strokeWidth={2}>
        <circle cx="14" cy="14" r="6" />
        <circle cx="8" cy="8" r="4" />
      </g>
      <rect x="6" y="38" width="58" height="34" rx="9" fill={c} stroke={O} strokeWidth={SW} />
      <rect x="58" y="24" width="36" height="48" rx="5" fill="#f87171" stroke={O} strokeWidth={SW} />
      <rect x="66" y="31" width="20" height="16" rx="3" fill="#bae6fd" stroke={O} strokeWidth={2} />
      <circle cx="22" cy="76" r="10" fill="#374151" stroke={O} strokeWidth={SW} />
      <circle cx="46" cy="76" r="10" fill="#374151" stroke={O} strokeWidth={SW} />
      <circle cx="78" cy="76" r="10" fill="#374151" stroke={O} strokeWidth={SW} />
    </g>
  ),
  // ---- 建築 ----
  house: (c = "#fbbf24") => (
    <g>
      <rect x="16" y="46" width="68" height="44" fill={c} stroke={O} strokeWidth={SW} />
      <polygon points="6,50 50,12 94,50" fill="#ef4444" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="42" y="60" width="16" height="30" rx="2" fill="#a16207" stroke={O} strokeWidth={SW} />
      <rect x="22" y="56" width="14" height="14" fill="#bae6fd" stroke={O} strokeWidth={2.5} />
      <rect x="64" y="56" width="14" height="14" fill="#bae6fd" stroke={O} strokeWidth={2.5} />
    </g>
  ),
  school: (c = "#fda4af") => (
    <g>
      <rect x="6" y="42" width="88" height="48" fill={c} stroke={O} strokeWidth={SW} />
      <rect x="34" y="22" width="32" height="26" fill="#fecdd3" stroke={O} strokeWidth={SW} />
      <polygon points="30,24 50,8 70,24" fill="#ef4444" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="50" cy="34" r="7" fill="#fff" stroke={O} strokeWidth={2.5} />
      <path d="M50 30V34H54" fill="none" stroke={O} strokeWidth={2} strokeLinecap="round" />
      <rect x="42" y="64" width="16" height="26" rx="2" fill="#a16207" stroke={O} strokeWidth={SW} />
      <g fill="#bae6fd" stroke={O} strokeWidth={2.5}>
        <rect x="12" y="52" width="16" height="14" />
        <rect x="72" y="52" width="16" height="14" />
        <rect x="12" y="72" width="16" height="12" />
        <rect x="72" y="72" width="16" height="12" />
      </g>
      <path d="M50 8V0" stroke={O} strokeWidth={2} />
    </g>
  ),
  // ---- 玩具與用品 ----
  balloon: (c = "#ef4444") => (
    <g>
      <path d="M50 74C46 82 56 88 50 98" fill="none" stroke="#64748b" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M50 70L44 80H56Z" fill={c} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx="50" cy="38" rx="27" ry="33" fill={c} stroke={O} strokeWidth={SW} />
      <ellipse cx="38" cy="26" rx="6" ry="10" fill="#fff" opacity=".5" transform="rotate(20 38 26)" />
    </g>
  ),
  ball: (c = "#60a5fa") => (
    <g>
      <circle cx="50" cy="52" r="38" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M14 42C38 54 62 54 86 42M14 64C38 52 62 52 86 64M50 14C42 36 42 68 50 90" fill="none" stroke="#fff" strokeWidth={5} opacity=".85" strokeLinecap="round" />
    </g>
  ),
  blocks: () => (
    <g stroke={O} strokeWidth={SW} strokeLinejoin="round">
      <rect x="10" y="54" width="38" height="36" rx="4" fill="#ef4444" />
      <rect x="52" y="54" width="38" height="36" rx="4" fill="#3b82f6" />
      <rect x="31" y="16" width="38" height="36" rx="4" fill="#facc15" />
      <circle cx="29" cy="72" r="6" fill="#fff" stroke="none" />
      <path d="M62 62H80M62 72H80M62 82H80" stroke="#fff" strokeWidth={3} />
      <path d="M40 34L50 24L60 34Z" fill="#fff" stroke="none" />
    </g>
  ),
  book: (c = "#3b82f6") => (
    <g>
      <rect x="78" y="16" width="7" height="68" rx="2" fill="#fff" stroke={O} strokeWidth={2.5} />
      <rect x="18" y="12" width="62" height="76" rx="5" fill={c} stroke={O} strokeWidth={SW} />
      <rect x="18" y="12" width="11" height="76" rx="4" fill="#000" opacity=".18" />
      <rect x="36" y="24" width="36" height="22" rx="3" fill="#fff" opacity=".9" />
      <path d="M40 54H70M40 64H62" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity=".85" />
    </g>
  ),
  pencil: (c = "#facc15") => (
    <g transform="rotate(35 50 50)">
      <rect x="39" y="14" width="22" height="56" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M39 70H61L50 92Z" fill="#fde7c3" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M45 82H55L50 92Z" fill="#374151" />
      <rect x="39" y="14" width="22" height="7" fill="#cbd5e1" stroke={O} strokeWidth={2} />
      <rect x="39" y="4" width="22" height="11" rx="4" fill="#f9a8d4" stroke={O} strokeWidth={SW} />
      <path d="M46 24V68M54 24V68" stroke="#000" opacity=".12" strokeWidth={2} />
    </g>
  ),
  bag: (c = "#f472b6") => (
    <g>
      <path d="M36 30C36 6 64 6 64 30" fill="none" stroke={O} strokeWidth={5} strokeLinecap="round" />
      <rect x="20" y="26" width="60" height="64" rx="16" fill={c} stroke={O} strokeWidth={SW} />
      <rect x="30" y="56" width="40" height="26" rx="8" fill="#000" opacity=".15" />
      <rect x="30" y="56" width="40" height="26" rx="8" fill="none" stroke={O} strokeWidth={2.5} />
      <path d="M30 42H70" stroke={O} strokeWidth={2.5} strokeDasharray="4 3" />
      <circle cx="50" cy="69" r="3" fill="#fde047" />
    </g>
  ),
  ruler: (c = "#fde047") => (
    <g transform="rotate(-20 50 50)">
      <rect x="4" y="38" width="92" height="26" rx="3" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M14 38V50M24 38V46M34 38V50M44 38V46M54 38V50M64 38V46M74 38V50M84 38V46" stroke={O} strokeWidth={2.2} />
    </g>
  ),
  stationery: () => (
    <g>
      <g transform="translate(-6 -4) scale(0.85)">{SHAPES.pencil("#f97316")}</g>
      <g transform="translate(14 22) scale(0.75)">{SHAPES.ruler("#fde047")}</g>
    </g>
  ),
  umbrella: (c = "#ef4444") => (
    <g>
      <path d="M50 52V80C50 92 36 92 36 82" fill="none" stroke={O} strokeWidth={5} strokeLinecap="round" />
      <path d="M6 54C6 14 94 14 94 54C86 46 76 46 70 54C64 46 56 46 50 54C44 46 36 46 30 54C24 46 14 46 6 54Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M50 20V52M28 28L30 52M72 28L70 52" stroke={O} strokeWidth={2} opacity=".5" />
    </g>
  ),
  // ---- 衣服 ----
  shirt: (c = "#60a5fa") => (
    <g>
      <path d="M32 12L8 28L20 46L30 40V88H70V40L80 46L92 28L68 12C64 22 36 22 32 12Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 12C36 22 64 22 68 12" fill="none" stroke="#fff" strokeWidth={3} opacity=".7" />
    </g>
  ),
  hat: (c = "#f97316") => (
    <g>
      <path d="M20 66C20 24 80 24 80 66Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="50" cy="68" rx="44" ry="12" fill={c} stroke={O} strokeWidth={SW} />
      <path d="M22 60Q50 68 78 60" fill="none" stroke="#fff" strokeWidth={5} opacity=".8" />
      <circle cx="50" cy="26" r="6" fill="#fde047" stroke={O} strokeWidth={2.5} />
    </g>
  ),
  dress: (c = "#f472b6") => (
    <g>
      <path d="M38 10H62L66 36L92 90H8L34 36Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M34 36H66" stroke="#fff" strokeWidth={5} />
      <path d="M44 10Q50 20 56 10" fill="none" stroke={O} strokeWidth={2.5} />
    </g>
  ),
  shoes: (c = "#ef4444") => (
    <g>
      <g transform="translate(0 6)">{shoe(0, c)}</g>
      <g transform="translate(46 6) scale(0.92)">{shoe(0, c)}</g>
    </g>
  ),
  socks: (c = "#a78bfa") => (
    <g>
      {sock(0, c)}
      {sock(44, c)}
    </g>
  ),
  gloves: (c = "#f97316") => (
    <g>
      {mitten(2, c)}
      {mitten(48, c)}
    </g>
  ),
  // ---- 家具與雜物 ----
  bed: (c = "#60a5fa") => (
    <g>
      <rect x="6" y="22" width="12" height="60" rx="3" fill="#a16207" stroke={O} strokeWidth={SW} />
      <rect x="6" y="48" width="88" height="22" rx="4" fill="#d6a46c" stroke={O} strokeWidth={SW} />
      <rect x="18" y="36" width="76" height="24" rx="6" fill={c} stroke={O} strokeWidth={SW} />
      <ellipse cx="32" cy="36" rx="13" ry="8" fill="#fff" stroke={O} strokeWidth={SW} />
      <rect x="84" y="62" width="9" height="22" rx="3" fill="#a16207" stroke={O} strokeWidth={SW} />
    </g>
  ),
  table: (c = "#d6a46c") => (
    <g>
      <rect x="14" y="44" width="9" height="46" rx="2" fill="#a16207" stroke={O} strokeWidth={SW} />
      <rect x="77" y="44" width="9" height="46" rx="2" fill="#a16207" stroke={O} strokeWidth={SW} />
      <rect x="6" y="32" width="88" height="14" rx="4" fill={c} stroke={O} strokeWidth={SW} />
    </g>
  ),
  road: () => (
    <g>
      <path d="M36 8H64L98 92H2Z" fill="#6b7280" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M50 14V24M50 34V48M50 58V76M50 86V92" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    </g>
  ),
  towel: (c = "#38bdf8") => (
    <g>
      <rect x="14" y="14" width="72" height="62" rx="6" fill={c} stroke={O} strokeWidth={SW} />
      <rect x="14" y="30" width="72" height="7" fill="#fff" opacity=".85" />
      <rect x="14" y="52" width="72" height="7" fill="#fff" opacity=".85" />
      <path d="M22 76V90M34 76V90M46 76V90M58 76V90M70 76V90M78 76V90" stroke={c} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  paper: () => (
    <g>
      <path d="M22 8H62L80 26V92H22Z" fill="#fff" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M62 8V26H80" fill="#e2e8f0" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 40H70M32 52H70M32 64H70M32 76H54" stroke="#94a3b8" strokeWidth={3.5} strokeLinecap="round" />
    </g>
  ),
  // ---- 人物 ----
  kid: () => person({ hair: "#3f2a1d", shirt: "#ef4444", scale: 0.95 }),
  kidgirl: () => person({ hair: "#3f2a1d", shirt: "#ec4899", scale: 0.95, tails: true }),
  dad: () => person({ hair: "#1f2937", shirt: "#3b82f6", scale: 1.0, glasses: false }),
  mom: () => person({ hair: "#7c2d12", shirt: "#f472b6", scale: 1.0, long: true, skirt: true }),
  brother: () => person({ hair: "#3f2a1d", shirt: "#22c55e", scale: 0.8 }),
  sister: () => person({ hair: "#92400e", shirt: "#facc15", scale: 0.8, long: true, skirt: true }),
  lilbro: () => person({ hair: "#3f2a1d", shirt: "#fb923c", scale: 0.6 }),
  lilsis: () => person({ hair: "#7c2d12", shirt: "#a78bfa", scale: 0.6, tails: true, skirt: true }),
  teacher: () => (
    <g>
      <rect x="2" y="10" width="56" height="46" rx="4" fill="#166534" stroke="#a16207" strokeWidth={4} />
      <path d="M10 24H40M10 34H32M10 44H44" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity=".85" />
      <g transform="translate(34 14) scale(0.78)">{person({ hair: "#374151", shirt: "#0ea5e9", scale: 1, glasses: true })}</g>
    </g>
  ),
  friends: () => (
    <g>
      <g transform="translate(-14 8) scale(0.82)">{person({ hair: "#3f2a1d", shirt: "#ef4444", scale: 1 })}</g>
      <g transform="translate(32 8) scale(0.82)">{person({ hair: "#7c2d12", shirt: "#ec4899", scale: 1, tails: true })}</g>
      <circle cx="50" cy="70" r="5" fill="#fff" stroke={O} strokeWidth={2} />
    </g>
  ),
  // ---- 筆畫 ----
  "stroke-h": (c = "#ef4444") => <path d="M12 50H88" stroke={c} strokeWidth={12} strokeLinecap="round" fill="none" />,
  "stroke-v": (c = "#ef4444") => <path d="M50 12V88" stroke={c} strokeWidth={12} strokeLinecap="round" fill="none" />,
  "stroke-p": (c = "#ef4444") => <path d="M74 12C66 44 46 72 22 88" stroke={c} strokeWidth={12} strokeLinecap="round" fill="none" />,
  "stroke-n": (c = "#ef4444") => <path d="M24 14C34 50 58 76 86 86" stroke={c} strokeWidth={12} strokeLinecap="round" fill="none" />,
};

export const ICON_NAMES = Object.keys(SHAPES);
export const hasIcon = (name: string) => name in SHAPES;

export function IconShape({ name, color }: { name: string; color?: string }) {
  const fn = SHAPES[name] ?? SHAPES.question;
  return <>{fn(color)}</>;
}

export function Icon({ name, color, size = 80, className }: { name: string; color?: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <IconShape name={name} color={color} />
    </svg>
  );
}
