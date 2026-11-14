import { Icon } from "./Illustration";

// 10 格進度條；第 5 題有小獎勵標記
export default function ProgressBar({ done, total, current }: { done: number; total: number; current: number }) {
  return (
    <div className="w-full" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < done;
          const isCurrent = i === current && !filled;
          const reward = (i + 1) % 5 === 0;
          return (
            <div key={i} className="relative flex-1">
              <div
                className={`h-4 rounded-full border-2 border-white/80 transition-all duration-500 ${
                  filled ? "bg-gradient-to-r from-yellow-300 to-orange-400" : isCurrent ? "bg-white" : "bg-white/50"
                }`}
              />
              {reward && (
                <span className={`absolute -top-3 right-0 ${filled ? "animate-shine" : "opacity-60"}`}>
                  <Icon name="star" size={20} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
