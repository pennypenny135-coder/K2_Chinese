import { useState } from "react";
import { PageShell } from "@/components/Layout";
import Bi from "@/components/Bi";
import { QUESTION_BY_ID } from "@/data/questions";
import { TOPICS, TOPIC_BY_ID } from "@/data/topics";
import type { Level } from "@/data/types";
import { T, formatDuration } from "@/lib/i18n";
import { navigate, quizUrl } from "@/lib/router";
import { playSfx } from "@/lib/soundEngine";
import { useProgress } from "@/hooks/useProgress";

function Ring({ pct, size = 96 }: { pct: number; size?: number }) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#22c55e" : pct >= 70 ? "#84cc16" : "#f59e0b";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontSize={size / 4} fontWeight="900" fill="#334155">{pct}%</text>
    </svg>
  );
}

const WEAK_BELOW = 70;
const MIN_ANSWERED = 5;

export default function ReportPage() {
  const { progress, recent, wrong, storageOk, clearAll } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  const levels: Level[] = ["K2", "K3"];
  const totalAnswered = Object.values(progress.topicStats).reduce((a, s) => a + s.answered, 0);
  const totalCorrect = Object.values(progress.topicStats).reduce((a, s) => a + s.correct, 0);
  const overall = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const weak: { level: Level; topicId: string; pct: number }[] = [];
  for (const lv of levels)
    for (const t of TOPICS) {
      const s = progress.topicStats[`${lv}:${t.id}`];
      if (s && s.answered >= MIN_ANSWERED && Math.round((s.correct / s.answered) * 100) < WEAK_BELOW)
        weak.push({ level: lv, topicId: t.id, pct: Math.round((s.correct / s.answered) * 100) });
    }

  const wrongList = Object.entries(wrong.items)
    .map(([id, n]) => ({ q: QUESTION_BY_ID[id], n }))
    .filter((x) => x.q)
    .sort((a, b) => b.n - a.n)
    .slice(0, 6);

  const kindName = (k: string) => (k === "mixed" ? T.mixed : k === "wrong" ? T.practiceWrong : TOPIC_BY_ID[k as keyof typeof TOPIC_BY_ID] ?? { zh: k, en: k });

  return (
    <PageShell back="/">
      <div className="mb-3 text-center">
        <Bi t={T.parentReport} zhClass="text-3xl text-violet-800" enClass="text-base text-violet-700" />
      </div>
      <p className="mb-3 rounded-2xl bg-white/70 px-3 py-2 text-center text-xs font-semibold text-slate-600">
        {T.parentTip.zh}
        <br />
        {T.parentTip.en}
      </p>

      <section className="rounded-3xl border-4 border-white bg-white/90 p-4 shadow">
        <div className="flex items-center gap-4">
          <Ring pct={overall} />
          <div className="flex-1 space-y-1">
            <Bi t={T.overall} align="left" zhClass="text-lg" enClass="text-xs" />
            <p className="text-sm font-bold text-slate-600">
              {T.questionsDone.zh}：{totalAnswered} · {T.questionsDone.en}
            </p>
            <p className="text-sm font-bold text-slate-600">
              {T.stars.zh} ⭐ {progress.stars} · {T.gamesPlayed.zh} {progress.gamesPlayed}
            </p>
          </div>
        </div>
        {weak.length > 0 && (
          <div className="mt-3 rounded-2xl bg-amber-100 p-3">
            {weak.map((w) => (
              <p key={w.level + w.topicId} className="text-sm font-black text-amber-800">
                {w.level} {TOPIC_BY_ID[w.topicId as keyof typeof TOPIC_BY_ID].zh}：{T.practiceRecommended.zh}
                <span className="block text-xs font-semibold opacity-80">
                  {w.level} {TOPIC_BY_ID[w.topicId as keyof typeof TOPIC_BY_ID].en}: {T.practiceRecommended.en}
                </span>
              </p>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 rounded-3xl border-4 border-white bg-white/90 p-4 shadow">
        <Bi t={T.topicAccuracy} align="left" zhClass="text-xl text-sky-700" enClass="text-xs" />
        {levels.map((lv) => (
          <div key={lv} className="mt-3">
            <div className="mb-1 inline-block rounded-full bg-sky-500 px-3 py-0.5 text-sm font-black text-white">{lv}</div>
            <div className="space-y-2">
              {TOPICS.map((t) => {
                const s = progress.topicStats[`${lv}:${t.id}`];
                const answered = s?.answered ?? 0;
                const pct = answered ? Math.round((s.correct / answered) * 100) : 0;
                const isWeak = answered >= MIN_ANSWERED && pct < WEAK_BELOW;
                const status = answered < MIN_ANSWERED ? T.notEnoughData : isWeak ? T.practiceRecommended : T.doingWell;
                return (
                  <div key={t.id}>
                    <div className="flex items-end justify-between gap-2">
                      <Bi zh={t.zh} en={t.en} align="left" zhClass="text-sm" enClass="text-[10px]" />
                      <span className={`text-right text-[11px] font-bold ${isWeak ? "text-amber-600" : answered < MIN_ANSWERED ? "text-slate-400" : "text-emerald-600"}`}>
                        {answered ? `${pct}% (${s.correct}/${answered})` : "—"} · {status.zh}
                        <span className="block text-[9px] font-semibold opacity-80">{status.en}</span>
                      </span>
                    </div>
                    <div className="mt-0.5 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full transition-all ${isWeak ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-3xl border-4 border-white bg-white/90 p-4 shadow">
        <Bi t={T.recent10} align="left" zhClass="text-xl text-emerald-700" enClass="text-xs" />
        {recent.items.length === 0 ? (
          <p className="mt-2 text-sm font-bold text-slate-500">
            {T.noRecords.zh} <span className="block text-xs font-semibold">{T.noRecords.en}</span>
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100">
            {recent.items.slice(0, 10).map((r, i) => {
              const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
              const name = kindName(r.kind);
              const d = new Date(r.date);
              const dur = formatDuration(r.seconds);
              return (
                <li key={r.date + i} className="flex items-center gap-2 py-2 text-sm">
                  <span className="w-12 shrink-0 rounded-full bg-sky-100 py-0.5 text-center text-xs font-black text-sky-700">{r.level}</span>
                  <div className="min-w-0 flex-1">
                    <Bi zh={name.zh} en={name.en} align="left" zhClass="text-sm" enClass="text-[10px]" />
                    <span className="text-[10px] font-semibold text-slate-400">
                      {d.toLocaleDateString("zh-HK")} {d.toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" })} · {dur.zh} / {dur.en}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-slate-700">{r.correct}/{r.total}</div>
                    <div className={`text-xs font-bold ${pct >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{pct}%</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-4 rounded-3xl border-4 border-white bg-white/90 p-4 shadow">
        <Bi t={T.wrongList} align="left" zhClass="text-xl text-rose-600" enClass="text-xs" />
        {wrongList.length === 0 ? (
          <p className="mt-2 text-sm font-bold text-slate-500">
            {T.noWrong.zh} <span className="block text-xs font-semibold">{T.noWrong.en}</span>
          </p>
        ) : (
          <>
            <ul className="mt-2 space-y-2">
              {wrongList.map(({ q, n }) => (
                <li key={q.id} className="flex items-start gap-2 rounded-2xl bg-rose-50 p-2 text-sm">
                  <span className="shrink-0 rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-black text-rose-700">{q.id}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-slate-700">{q.questionZh.split("\n").pop()}</div>
                    <div className="truncate text-[10px] font-semibold text-slate-500">{q.questionEn.split("\n").pop()}</div>
                  </div>
                  <span className="shrink-0 text-xs font-black text-rose-600">×{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-1 text-[10px] font-semibold text-slate-400">{T.wrongCount.zh} / {T.wrongCount.en}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {levels.map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => { playSfx("click"); navigate(quizUrl(lv, "wrong")); }}
                  className="btn-big rounded-full border-4 border-white bg-rose-400 px-3 py-2 text-white"
                >
                  <span className="block text-lg font-black">{lv}</span>
                  <Bi t={T.practiceWrong} zhClass="text-sm" enClass="text-[10px]" />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mt-6">
        {!storageOk && (
          <p className="mb-2 text-center text-xs font-bold text-amber-700">{T.storageOff.zh} {T.storageOff.en}</p>
        )}
        {cleared && !confirming && (
          <p className="mb-2 text-center text-sm font-bold text-emerald-700">{T.cleared.zh} · {T.cleared.en}</p>
        )}
        {!confirming ? (
          <button
            type="button"
            onClick={() => { playSfx("click"); setConfirming(true); setCleared(false); }}
            className="btn-big w-full rounded-full border-4 border-white bg-slate-400 px-6 py-3 text-white"
          >
            <Bi t={T.clearRecords} zhClass="text-xl" enClass="text-sm" />
          </button>
        ) : (
          <div className="rounded-3xl border-4 border-rose-300 bg-rose-50 p-4 text-center">
            <Bi t={T.clearAsk} zhClass="text-base text-rose-700" enClass="text-xs text-rose-600" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirming(false)} className="btn-big rounded-full border-4 border-white bg-slate-400 px-3 py-2 text-white">
                <Bi t={T.cancel} zhClass="text-lg" enClass="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => { clearAll(); setConfirming(false); setCleared(true); }}
                className="btn-big rounded-full border-4 border-white bg-rose-500 px-3 py-2 text-white"
              >
                <Bi t={T.clearYes} zhClass="text-lg" enClass="text-xs" />
              </button>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
