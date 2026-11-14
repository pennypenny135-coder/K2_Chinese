import { useEffect } from "react";
import HomePage from "@/app/page";
import K2Page from "@/app/k2/page";
import K3Page from "@/app/k3/page";
import QuizPage from "@/app/quiz/page";
import ReportPage from "@/app/report/page";
import BadgesPage from "@/app/badges/page";
import { useRoute } from "@/lib/router";
import { startMusic, stopMusic, unlockAudio } from "@/lib/soundEngine";
import { cancelSpeech, initSpeech } from "@/lib/speechEngine";
import { getState } from "@/lib/store";

export default function App() {
  const route = useRoute();

  useEffect(() => {
    initSpeech();
    // 瀏覽器要求先有使用者互動，先可以播放聲音
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    const onVis = () => {
      if (document.hidden) {
        stopMusic();
        cancelSpeech();
      } else if (getState().settings.music) startMusic();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    cancelSpeech();
  }, [route.path]);

  let page;
  switch (route.path) {
    case "/k2":
      page = <K2Page />;
      break;
    case "/k3":
      page = <K3Page />;
      break;
    case "/quiz": {
      const level = route.params.get("level") === "K3" ? "K3" : "K2";
      page = <QuizPage level={level} topic={route.params.get("topic")} />;
      break;
    }
    case "/report":
      page = <ReportPage />;
      break;
    case "/badges":
      page = <BadgesPage />;
      break;
    default:
      page = <HomePage />;
  }
  return <div key={route.path}>{page}</div>;
}
