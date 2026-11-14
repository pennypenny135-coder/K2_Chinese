import { PageShell } from "@/components/Layout";
import Bi from "@/components/Bi";
import CharacterMascot from "@/components/CharacterMascot";
import { Icon } from "@/components/Illustration";
import { T } from "@/lib/i18n";
import { navigate } from "@/lib/router";
import { playSfx, unlockAudio } from "@/lib/soundEngine";
import { useProgress } from "@/hooks/useProgress";

// 主頁：只保留 4 個大按鈕
export default function HomePage() {
  const { progress } = useProgress();
  const go = (to: string) => {
    unlockAudio();
    playSfx("click");
    navigate(to);
  };
  return (
    <PageShell header={<span className="rounded-full bg-white/80 px-3 py-2 text-sm font-black text-orange-600">⭐ {progress.stars}</span>}>
      <div className="flex flex-col items-center text-center">
        <div className="relative mt-1">
          <CharacterMascot mood="idle" size={150} />
          <Icon name="star" size={34} className="absolute -left-4 top-2 animate-wiggle" />
          <Icon name="balloon" size={44} color="#f472b6" className="absolute -right-8 top-0 animate-float" />
        </div>
        <h1 className="mt-1 rounded-3xl bg-white/80 px-5 py-2 shadow">
          <Bi t={T.appName} zhClass="text-4xl text-orange-500" enClass="text-base text-sky-700" />
        </h1>
        <p className="mt-2 text-sky-900">
          <Bi t={T.homeHello} zhClass="text-lg" enClass="text-sm" />
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <button type="button" onClick={() => go("/k2")} className="btn-big flex w-full items-center justify-between gap-3 rounded-full border-4 border-white bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-3 text-white">
          <Icon name="apple" size={54} />
          <div className="flex-1">
            <Bi t={T.startK2} zhClass="text-3xl" enClass="text-base" />
            <Bi t={T.k2Sub} zhClass="text-xs" enClass="text-[10px]" />
          </div>
        </button>
        <button type="button" onClick={() => go("/k3")} className="btn-big flex w-full items-center justify-between gap-3 rounded-full border-4 border-white bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-white">
          <Icon name="book" size={54} />
          <div className="flex-1">
            <Bi t={T.startK3} zhClass="text-3xl" enClass="text-base" />
            <Bi t={T.k3Sub} zhClass="text-xs" enClass="text-[10px]" />
          </div>
        </button>
        <button type="button" onClick={() => go("/badges")} className="btn-big flex w-full items-center justify-between gap-3 rounded-full border-4 border-white bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 text-white">
          <Icon name="star" size={54} />
          <div className="flex-1">
            <Bi t={T.myStars} zhClass="text-2xl" enClass="text-sm" />
          </div>
        </button>
        <button type="button" onClick={() => go("/report")} className="btn-big flex w-full items-center justify-between gap-3 rounded-full border-4 border-white bg-gradient-to-r from-violet-400 to-fuchsia-500 px-6 py-3 text-white">
          <Icon name="paper" size={54} />
          <div className="flex-1">
            <Bi t={T.parentReport} zhClass="text-2xl" enClass="text-sm" />
          </div>
        </button>
      </div>
      <p className="mt-5 text-center text-xs font-bold text-sky-900/70">
        {T.offlineReady.zh} · {T.offlineReady.en}
      </p>
    </PageShell>
  );
}
