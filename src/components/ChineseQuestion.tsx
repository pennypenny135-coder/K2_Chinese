import type { Choice, Question } from "@/data/types";
import { Icon } from "./Illustration";
import QuestionVisual from "./QuestionVisual";
import SpeakerButton from "./SpeakerButton";
import Bi from "./Bi";
import { cn } from "@/utils/cn";

interface Props {
  q: Question;
  wrong: number[]; // 已揀錯嘅選項
  solved: number | null; // 已答啱嘅選項
  onChoose: (index: number) => void;
  onBeforeSpeak?: () => void;
}

function ChoiceCard({
  choice,
  style,
  state,
  revealed,
  onClick,
  onBeforeSpeak,
}: {
  choice: Choice;
  style: "text" | "icon" | "color" | "swatch";
  state: "idle" | "wrong" | "correct" | "dim";
  revealed: boolean;
  onClick: () => void;
  onBeforeSpeak?: () => void;
}) {
  const iconOnly = (style === "icon" || style === "swatch") && !revealed;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        disabled={state === "wrong" || state === "correct"}
        aria-label={`${choice.zh} ${choice.en}`}
        className={cn(
          "btn-big flex h-full min-h-[92px] w-full flex-col items-center justify-center gap-1 rounded-3xl border-4 px-2 py-2 text-slate-800",
          state === "idle" && "border-sky-300 bg-white",
          state === "wrong" && "animate-soft-shake border-orange-300 bg-orange-100 opacity-70",
          state === "correct" && "animate-correct border-emerald-500 bg-emerald-100",
          state === "dim" && "border-slate-200 bg-white/70 opacity-60",
        )}
      >
        {(style === "color" || style === "swatch") && choice.color ? (
          <span className="h-14 w-14 rounded-full border-4 border-white shadow-md ring-2 ring-slate-300" style={{ background: choice.color }} />
        ) : choice.icon && choice.count ? (
          <span className="flex max-w-[150px] flex-wrap items-center justify-center gap-0.5">
            {Array.from({ length: choice.count }).map((_, k) => (
              <Icon key={k} name={choice.icon!} color={choice.iconColor} size={choice.count! > 6 ? 24 : 30} />
            ))}
          </span>
        ) : choice.icon ? (
          <Icon name={choice.icon} color={choice.iconColor} size={iconOnly ? 84 : 58} />
        ) : null}
        {!iconOnly && (
          <Bi
            zh={choice.zh}
            en={choice.en}
            zhClass={cn(choice.zh.length > 8 ? "text-lg" : choice.zh.length > 3 ? "text-2xl" : "text-3xl")}
            enClass="text-[11px] sm:text-xs"
          />
        )}
        {state === "correct" && <span className="absolute right-3 top-2 text-2xl">✅</span>}
      </button>
      {((style !== "icon" && style !== "swatch") || revealed) && (
        <SpeakerButton
          text={choice.zh}
          size="sm"
          label={`聽選項 Hear choice: ${choice.zh}`}
          className="absolute -right-1.5 -top-2 !h-10 !w-10 bg-sky-400"
          onBeforeSpeak={onBeforeSpeak}
        />
      )}
    </div>
  );
}

export default function ChineseQuestion({ q, wrong, solved, onChoose, onBeforeSpeak }: Props) {
  const style = q.choiceStyle ?? "text";
  const longChoices = q.choices.some((c) => c.zh.length > 7);
  const isSolved = solved !== null;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[2rem] border-4 border-white bg-white/85 p-4 shadow-lg">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
            {q.level} · {q.topic} {q.topicEn}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <Bi t={{ zh: q.questionZh, en: q.questionEn }} align="left" zhClass="text-2xl sm:text-3xl text-slate-800 whitespace-pre-line" enClass="text-sm sm:text-base text-slate-600 whitespace-pre-line" />
          </div>
          <SpeakerButton text={q.audioText} label="朗讀題目 Read the question aloud" onBeforeSpeak={onBeforeSpeak} />
        </div>
        {q.imageType !== "none" && (
          <div className="mt-3 flex items-center justify-center">
            <QuestionVisual q={q} />
          </div>
        )}
      </div>
      <div className={cn("grid gap-3", longChoices ? "grid-cols-1" : "grid-cols-2")}>
        {q.choices.map((c, i) => {
          const state = solved === i ? "correct" : wrong.includes(i) ? "wrong" : isSolved ? "dim" : "idle";
          return (
            <ChoiceCard
              key={`${q.id}-${i}`}
              choice={c}
              style={style}
              state={state}
              revealed={isSolved || wrong.includes(i)}
              onClick={() => onChoose(i)}
              onBeforeSpeak={onBeforeSpeak}
            />
          );
        })}
      </div>
    </div>
  );
}
