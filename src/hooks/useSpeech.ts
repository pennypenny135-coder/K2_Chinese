import { useCallback, useEffect, useState } from "react";
import { cancelSpeech, initSpeech, isSpeaking, isSpeechSupported, onSpeakingChange, speakText } from "@/lib/speechEngine";

/** 朗讀 hook：不支援語音時 supported=false，介面應隱藏喇叭按鈕 */
export function useSpeech() {
  const supported = isSpeechSupported();
  const [speaking, setSpeaking] = useState(isSpeaking());

  useEffect(() => {
    initSpeech();
    return onSpeakingChange(setSpeaking);
  }, []);

  const speak = useCallback((text: string, force = true) => speakText(text, { force }), []);
  const cancel = useCallback(() => cancelSpeech(), []);

  return { supported, speaking, speak, cancel };
}
