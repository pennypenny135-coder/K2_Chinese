import { useSyncExternalStore } from "react";
import { clearAllRecords, getState, recordGame, setSettings, subscribe } from "@/lib/store";
import { isStorageAvailable } from "@/lib/storage";

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getState, getState);
  return {
    ...state,
    storageOk: isStorageAvailable(),
    recordGame,
    clearAll: clearAllRecords,
    setSettings,
  };
}
