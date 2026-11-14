import Bi from "./Bi";
import CharacterMascot from "./CharacterMascot";
import { Icon } from "./Illustration";
import { BADGE_BY_ID } from "@/lib/badges";
import { T, formatDuration } from "@/lib/i18n";

interface Props {
  total: number;
  correct: number;
  seconds: number;
  bestCombo: number;
  sticker: string | null;
  newBadges: string[];
  onAgain: () => void;
  onHome: () => void;
}

export default function ResultCard({ total, correct, seconds, bestCombo, sticker, newBadges, onAgain, onHome }: Props) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const rating = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
  const msg = pct >= 90 ? T.resultGreat : pct >= 70 ? T.resultGood : T.resultKeep;
  const dur = formatDuration(seconds);
  return (
    <div className="animate-slide-up flex flex-col items-center gap-4 text-center">
      <CharacterMascot mood="cheer" size={130} />
      <div className="w-full rounded-[2rem] border-4 border-white bg-white/90 p-5 shadow-xl">
        <Bi t={msg} zhClass="text-2xl text-orange-600" enClass="text-sm text-slate-600" />
        <div className="my-4 flex items-center justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= rating ? "animate-pop-in" : "opacity-25 grayscale"} style={{ animationDelay: `${i * 0.2}s` }}>
              <Icon name="star" size={i === 2 ? 84 : 66} />
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-yellow-100 p-2">
            <Bi t={T.stars} zhClass="text-base" enClass="text-xs" />
            <div className="text-3xl font-black text-yellow-600">⭐ {correct}</div>
          </div>
          <div className="rounded-2xl bg-emerald-100 p-2">
            <Bi t={T.accuracy} zhClass="text-base" enClass="text-xs" />
            <div className="text-3xl font-black text-emerald-600">{pct}%</div>
          </div>
          <div className="rounded-2xl bg-sky-100 p-2">
            <Bi t={T.time} zhClass="text-base" enClass="text-xs" />
            <div className="text-lg font-black leading-tight text-sky-700">
              <Bi t={dur} zhClass="text-lg" enClass="text-[11px]" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm font-bold text-slate-600">
          {T.firstTry.zh} {correct}/{total} · {T.combo.zh} {bestCombo} <span className="opacity-70">({T.firstTry.en}; {T.combo.en})</span>
        </p>
        {sticker && (
          <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-pink-100 p-2">
            <Icon name={sticker} size={56} className="animate-wiggle" />
            <Bi t={T.newSticker} zhClass="text-lg text-pink-600" enClass="text-xs" />
          </div>
        )}
        {newBadges.map((id) => {
          const b = BADGE_BY_ID[id];
          if (!b) return null;
          return (
            <div key={id} className="animate-pop-in mt-3 flex items-center justify-center gap-3 rounded-2xl bg-violet-100 p-2">
              <Icon name={b.icon} size={56} className="animate-shine" />
              <div>
                <Bi t={T.newBadge} zhClass="text-sm text-violet-600" enClass="text-[10px]" align="left" />
                <Bi t={b.name} zhClass="text-lg text-violet-800" enClass="text-xs" align="left" />
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={onAgain} className="btn-big w-full rounded-full border-4 border-white bg-emerald-500 px-6 py-3 text-white">
        <Bi t={T.playAgain} zhClass="text-2xl" enClass="text-sm" />
      </button>
      <button type="button" onClick={onHome} className="btn-big w-full rounded-full border-4 border-white bg-orange-400 px-6 py-3 text-white">
        <Bi t={T.backHome} zhClass="text-2xl" enClass="text-sm" />
      </button>
    </div>
  );
}
