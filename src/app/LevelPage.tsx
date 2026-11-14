import { PageShell } from "@/components/Layout";
import Bi from "@/components/Bi";
import CharacterMascot from "@/components/CharacterMascot";
import { Icon } from "@/components/Illustration";
import { getBankStats } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import type { Level } from "@/data/types";
import { T } from "@/lib/i18n";
import { navigate, quizUrl } from "@/lib/router";
import { playSfx, unlockAudio } from "@/lib/soundEngine";
import { useProgress } from "@/hooks/useProgress";

// K2 / K3 選主題頁（共用）
export default function LevelPage({ level }: { level: Level }) {
  const { progress } = useProgress();
  const stats = getBankStats();
  const sub = level === "K2" ? T.k2Sub : T.k3Sub;

  const go = (kind: string) => {
    unlockAudio();
    playSfx("click");
    navigate(quizUrl(level, kind));
  };

  return (
    <PageShell back="/">
      <div className="mb-4 flex items-center gap-3">
        <CharacterMascot mood="idle" size={86} />
        <div className="flex-1 rounded-3xl border-4 border-white bg-white/85 px-4 py-2">
          <div className="text-4xl font-black text-sky-700">{level}</div>
          <Bi t={sub} align="left" zhClass="text-sm text-slate-600" enClass="text-xs" />
        </div>
      </div>
      <div className="mb-2">
        <Bi t={T.chooseTopic} zhClass="text-2xl text-sky-900" enClass="text-sm text-sky-800" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TOPICS.map((t) => {
          const s = progress.topicStats[`${level}:${t.id}`];
          const pct = s && s.answered ? Math.round((s.correct / s.answered) * 100) : null;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              className={`btn-big flex min-h-[132px] flex-col items-center justify-center gap-1 rounded-3xl border-4 border-white p-3 text-slate-800 ${t.bg}`}
              aria-label={`${t.zh} ${t.en}`}
            >
              <Icon name={t.icon} size={56} />
              <Bi zh={t.zh} en={t.en} zhClass="text-xl" enClass="text-[11px]" />
              <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold">
                {pct === null ? `${stats.byTopic[level][t.id]} ${T.pool.zh}` : `${pct}% ⭐`}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => go("mixed")}
        className="btn-big mt-4 flex w-full items-center justify-center gap-3 rounded-full border-4 border-white bg-gradient-to-r from-pink-400 to-orange-400 px-6 py-3 text-white"
      >
        <Icon name="star" size={44} className="animate-wiggle" />
        <div>
          <Bi t={T.mixed} zhClass="text-2xl" enClass="text-sm" />
          <Bi t={T.mixedSub} zhClass="text-xs" enClass="text-[10px]" />
        </div>
      </button>
    </PageShell>
  );
}
