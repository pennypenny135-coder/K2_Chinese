import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/Layout";
import ChineseQuestion from "@/components/ChineseQuestion";
import CharacterMascot, { type Mood } from "@/components/CharacterMascot";
import Confetti from "@/components/Confetti";
import ProgressBar from "@/components/ProgressBar";
import ResultCard from "@/components/ResultCard";
import Bi from "@/components/Bi";
import { Icon } from "@/components/Illustration";
import { pickQuiz, type QuizKind } from "@/data/questions";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import type { Level } from "@/data/types";
import { CORRECT_PRAISES, T } from "@/lib/i18n";
import { navigate } from "@/lib/router";
import { getState, recordGame, type QuestionOutcome, type RecordOutcome } from "@/lib/store";
import { playSfx, sfxRemainingMs, unlockAudio } from "@/lib/soundEngine";
import { cancelSpeech, speakText } from "@/lib/speechEngine";
import { useSpeech } from "@/hooks/useSpeech";

const TOTAL = 10;

function parseKind(v: string | null): QuizKind {
  if (v === "mixed" || v === "wrong") return v;
  return TOPICS.find((t) => t.id === v)?.id ?? "mixed";
}

export default function QuizPage({ level, topic }: { level: Level; topic: string | null }) {
  const [round, setRound] = useState(0);
  const kind = parseKind(topic);
  return <QuizSession key={`${level}-${kind}-${round}`} level={level} kind={kind} onAgain={() => setRound((r) => r + 1)} />;
}

function QuizSession({ level, kind, onAgain }: { level: Level; kind: QuizKind; onAgain: () => void }) {
  useSpeech(); // 初始化語音（載入語音清單）
  const [questions] = useState(() => pickQuiz(level, kind, Object.keys(getState().wrong.items), TOTAL));
  const [idx, setIdx] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState<number | null>(null);
  const [outcomes, setOutcomes] = useState<QuestionOutcome[]>([]);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [animKey, setAnimKey] = useState(0);
  const [burst, setBurst] = useState(0);
  const [praise, setPraise] = useState(CORRECT_PRAISES[0]);
  const [milestone, setMilestone] = useState(false);
  const [result, setResult] = useState<{ seconds: number; rec: RecordOutcome; correct: number } | null>(null);
  const startRef = useRef(Date.now());
  const timers = useRef<number[]>([]);

  const q = questions[Math.min(idx, questions.length - 1)];
  const total = questions.length;

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  // 每題自動朗讀題目
  useEffect(() => {
    if (!q || result) return;
    const t = window.setTimeout(() => speakText(q.audioText), 500);
    return () => {
      window.clearTimeout(t);
      cancelSpeech();
    };
  }, [q, result]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const finish = useCallback(
    (all: QuestionOutcome[], best: number) => {
      const seconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
      const rec = recordGame(level, kind, all, seconds, best);
      setResult({ seconds, rec, correct: all.filter((o) => o.firstTryCorrect).length });
      setMood("cheer");
      setBurst((b) => b + 1);
      later(() => playSfx("win"), 200);
    },
    [kind, later, level],
  );

  const onChoose = (i: number) => {
    unlockAudio();
    if (solved !== null || !q) return;
    clearTimers();
    if (i === q.correctIndex) {
      const first = wrong.length === 0;
      const nextCombo = first ? combo + 1 : 0;
      const nextBest = Math.max(bestCombo, nextCombo);
      setSolved(i);
      setCombo(nextCombo);
      setBestCombo(nextBest);
      setOutcomes((o) => [...o, { id: q.id, topicId: q.topicId, firstTryCorrect: first }]);
      setPraise(CORRECT_PRAISES[Math.floor(Math.random() * CORRECT_PRAISES.length)]);
      setMood("happy");
      setAnimKey((k) => k + 1);
      setBurst((b) => b + 1);
      playSfx("correct");
      if (first) later(() => playSfx("star"), 520);
      if (first && nextCombo >= 3) later(() => playSfx("combo"), 1100);
      // 稍後朗讀解釋
      later(() => speakText(q.explanationZh), Math.max(900, sfxRemainingMs() + 1400));
    } else {
      setWrong((w) => [...w, i]);
      setCombo(0);
      setMood("try");
      setAnimKey((k) => k + 1);
      playSfx("wrong");
    }
  };

  const next = () => {
    clearTimers();
    cancelSpeech();
    playSfx("click");
    if (idx + 1 >= total) {
      finish(outcomes, bestCombo);
      return;
    }
    if (idx + 1 === 5 && !milestone) {
      // 每完成 5 題，小獎勵
      setMilestone(true);
      setMood("cheer");
      setBurst((b) => b + 1);
      later(() => playSfx("star"), 300);
      return;
    }
    goNext();
  };

  const goNext = () => {
    setIdx((n) => n + 1);
    setWrong([]);
    setSolved(null);
    setMood("idle");
  };

  const topicTitle =
    kind === "mixed" ? T.mixed : kind === "wrong" ? T.practiceWrong : { zh: TOPIC_BY_ID[kind].zh, en: TOPIC_BY_ID[kind].en };

  if (result) {
    return (
      <PageShell back={`/${level.toLowerCase()}`}>
        <Confetti burstKey={burst} big />
        <ResultCard
          total={total}
          correct={result.correct}
          seconds={result.seconds}
          bestCombo={bestCombo}
          sticker={result.rec.newSticker}
          newBadges={result.rec.newBadges}
          onAgain={onAgain}
          onHome={() => navigate("/")}
        />
      </PageShell>
    );
  }

  const bubble =
    solved !== null ? praise : wrong.length > 0 ? T.tryAgain : { zh: "揀一個答案啦！", en: "Pick an answer!" };

  return (
    <PageShell back={`/${level.toLowerCase()}`}>
      <Confetti burstKey={solved !== null ? burst : 0} big={combo > 0 && combo % 5 === 0} />
      <div className="mb-2 flex items-center justify-between text-sm font-black text-sky-900">
        <Bi t={topicTitle} align="left" zhClass="text-base" enClass="text-xs" />
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs">
          {T.questionOf.zh} {Math.min(idx + 1, total)} / {total} <span className="font-semibold opacity-70">· {T.questionOf.en} {Math.min(idx + 1, total)}</span>
        </span>
      </div>
      <div className="mb-3 pt-2">
        <ProgressBar done={outcomes.length} total={total} current={idx} />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="shrink-0">
          <CharacterMascot mood={mood} size={84} animKey={animKey} />
        </div>
        <div
          key={`${bubble.zh}-${animKey}`}
          className={`animate-pop-in relative flex-1 rounded-3xl border-4 px-3 py-2 ${
            wrong.length > 0 && solved === null ? "border-orange-300 bg-orange-50 text-orange-700" : solved !== null ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-white bg-white/85 text-sky-800"
          }`}
        >
          <Bi t={bubble} align="left" zhClass="text-lg" enClass="text-sm" />
        </div>
        {combo >= 2 && (
          <div key={combo} className="animate-pop-in flex shrink-0 flex-col items-center rounded-2xl bg-orange-400 px-2 py-1 text-white shadow">
            <span className="text-xl leading-none">🔥×{combo}</span>
            <span className="text-[10px] font-bold leading-tight">{T.combo.zh} {T.combo.en}</span>
          </div>
        )}
      </div>

      <ChineseQuestion
        key={q.id}
        q={q}
        wrong={wrong}
        solved={solved}
        onChoose={onChoose}
        onBeforeSpeak={unlockAudio}
      />

      {solved !== null && (
        <div className="animate-slide-up mt-4 flex flex-col gap-3">
          <div className="rounded-3xl border-4 border-white bg-white/90 p-3 shadow">
            <Bi zh={q.explanationZh} en={q.explanationEn} align="left" zhClass="text-lg text-slate-700" enClass="text-sm text-slate-500" />
          </div>
          <button type="button" onClick={next} className="btn-big w-full rounded-full border-4 border-white bg-emerald-500 px-6 py-3 text-white">
            <Bi t={idx + 1 >= total ? T.finish : T.next} zhClass="text-2xl" enClass="text-sm" />
          </button>
        </div>
      )}

      {milestone && idx + 1 === 5 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-sky-900/50 p-6">
          <div className="animate-pop-in w-full max-w-sm rounded-[2rem] border-4 border-white bg-white p-5 text-center shadow-2xl">
            <CharacterMascot mood="cheer" size={110} />
            <Icon name="star" size={72} className="mx-auto animate-shine" />
            <Bi t={T.halfway} zhClass="text-2xl text-orange-600" enClass="text-sm text-slate-600" />
            <div className="mt-1">
              <Bi t={T.halfwaySub} zhClass="text-base text-slate-700" enClass="text-xs text-slate-500" />
            </div>
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setMilestone(false);
                goNext();
              }}
              className="btn-big mt-4 w-full rounded-full border-4 border-white bg-emerald-500 px-6 py-3 text-white"
            >
              <Bi t={T.continue} zhClass="text-2xl" enClass="text-sm" />
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
