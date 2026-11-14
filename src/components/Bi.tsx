import type { Bi as BiText } from "@/lib/i18n";
import { cn } from "@/utils/cn";

interface Props {
  t?: BiText;
  zh?: string;
  en?: string;
  className?: string;
  zhClass?: string;
  enClass?: string;
  align?: "center" | "left";
}

// 中英對照：中文在上（粗圓體），英文在下（略細但清晰）
export default function Bi({ t, zh, en, className, zhClass, enClass, align = "center" }: Props) {
  const z = t?.zh ?? zh ?? "";
  const e = t?.en ?? en ?? "";
  return (
    <span className={cn("flex flex-col leading-tight", align === "center" ? "items-center text-center" : "items-start text-left", className)}>
      <span className={cn("font-black tracking-wide", zhClass)}>{z}</span>
      {e && <span className={cn("text-[0.62em] font-semibold tracking-normal opacity-85", enClass)}>{e}</span>}
    </span>
  );
}
