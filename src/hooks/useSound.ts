import { useCallback } from "react";
import { playSfx, startMusic, stopMusic, unlockAudio, type Sfx } from "@/lib/soundEngine";
import { setSettings } from "@/lib/store";
import { useProgress } from "./useProgress";

export function useSound() {
  const { settings } = useProgress();

  const play = useCallback((name: Sfx) => playSfx(name), []);

  const toggleSound = useCallback(() => {
    setSettings({ sound: !settings.sound });
  }, [settings.sound]);

  const toggleMusic = useCallback(() => {
    const next = !settings.music;
    setSettings({ music: next });
    if (next) {
      unlockAudio();
      startMusic();
    } else stopMusic();
  }, [settings.music]);

  const toggleSpeech = useCallback(() => {
    setSettings({ speech: !settings.speech });
  }, [settings.speech]);

  return { play, settings, toggleSound, toggleMusic, toggleSpeech, unlock: unlockAudio };
}
