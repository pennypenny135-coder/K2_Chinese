import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";

interface Props {
  text: string;
  size?: "lg" | "sm";
  className?: string;
  label?: string;
  onBeforeSpeak?: () => void;
}

// 喇叭按鈕：裝置唔支援語音時完全唔顯示
export default function SpeakerButton({ text, size = "lg", className, label = "朗讀 Read aloud", onBeforeSpeak }: Props) {
  const { supported, speaking, speak } = useSpeech();
  if (!supported) return null;
  const big = size === "lg";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onBeforeSpeak?.();
        speak(text, true);
      }}
      className={cn(
        "btn-big flex shrink-0 items-center justify-center rounded-full border-4 border-white bg-sky-500 text-white",
        big ? "h-16 w-16" : "h-12 w-12 min-h-0 border-2 shadow-none",
        speaking && "animate-pulse bg-orange-400",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" width={big ? 34 : 24} height={big ? 34 : 24} fill="currentColor" aria-hidden="true">
        <path d="M3 9v6h4l5 4V5L7 9H3z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
