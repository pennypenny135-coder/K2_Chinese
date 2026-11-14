import { PageShell } from "@/components/Layout";
import Bi from "@/components/Bi";
import CharacterMascot from "@/components/CharacterMascot";
import { Icon } from "@/components/Illustration";
import { BADGES, STICKERS } from "@/lib/badges";
import { T } from "@/lib/i18n";
import { useProgress } from "@/hooks/useProgress";

// 我的星星與獎章
export default function BadgesPage() {
  const { progress, badges } = useProgress();
  return (
    <PageShell back="/">
      <div className="flex items-center gap-3">
        <CharacterMascot mood={progress.stars > 0 ? "happy" : "idle"} size={90} />
        <div className="flex-1 rounded-3xl border-4 border-white bg-white/85 p-3 text-center">
          <Bi t={T.totalStars} zhClass="text-lg text-slate-700" enClass="text-xs" />
          <div className="flex items-center justify-center gap-2 text-5xl font-black text-yellow-500">
            <Icon name="star" size={48} className="animate-shine" /> {progress.stars}
          </div>
          <p className="text-xs font-bold text-slate-500">
            {T.gamesPlayed.zh} {progress.gamesPlayed} · {T.gamesPlayed.en}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border-4 border-white bg-white/80 p-3">
        <Bi t={T.badges} align="left" zhClass="text-xl text-violet-700" enClass="text-xs" />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {BADGES.map((b) => {
            const got = !!badges.earned[b.id];
            return (
              <div key={b.id} className={`flex flex-col items-center rounded-2xl p-2 text-center ${got ? "bg-violet-100" : "bg-slate-100"}`} title={`${b.desc.zh} ${b.desc.en}`}>
                <div className={got ? "animate-pop-in" : "opacity-30 grayscale"}>
                  <Icon name={b.icon} size={52} />
                </div>
                <Bi t={b.name} zhClass="text-xs" enClass="text-[9px]" />
                <span className="mt-0.5 text-[9px] font-semibold leading-tight text-slate-500">{got ? b.desc.zh : T.locked.zh}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border-4 border-white bg-white/80 p-3">
        <Bi t={T.stickers} align="left" zhClass="text-xl text-pink-600" enClass="text-xs" />
        <p className="text-[11px] font-semibold text-slate-500">每完成 10 題得一張貼紙 · One sticker for every 10 questions</p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {STICKERS.map((s) => {
            const got = progress.stickers.includes(s);
            return (
              <div key={s} className={`flex items-center justify-center rounded-2xl p-1 ${got ? "bg-pink-100" : "bg-slate-100"}`}>
                <div className={got ? "" : "opacity-20 grayscale"}>
                  <Icon name={s} size={44} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
