import { create } from "zustand";

import type { GameLevels, Level, Break } from "@/schemas";
import { TimerData, getDefaultTimerData } from "@/schemas";
import { localLoad, localSave } from "@/lib/storage-utils";
import { client } from "@/rpc/rpc-client";
// import { useNavigate } from "react-router";

interface GameState {
  timerData: TimerData;
  minutes: number;
  seconds: number;
  connecting: boolean;
  sharing: boolean;
  code: string;
}

interface GameActions {
  resetTimer: () => void;
  updateData: (input: Partial<TimerData>) => void;
  setLevels: (levels: GameLevels) => void;
  setMinutes: (minutes: number) => void;
  setSeconds: (seconds: number) => void;
  doTick: (goToConfig: () => void) => void;
  startTimer: () => void;
  togglePlay: () => void;
  startSharing: () => void;
}

export const useGameStore = create<GameState & GameActions>()((set, get) => ({
  minutes: 0,
  seconds: 0,
  timerData: getInitialTimerData(),
  connecting: false,
  sharing: false,
  code: "",

  setLevels: (levels: GameLevels) => get().updateData({ levels }),
  setMinutes: (minutes: number) => set({ minutes }),
  setSeconds: (seconds: number) => set({ seconds }),
  resetTimer: () => set({ timerData: getDefaultTimerData() }),

  startTimer() {
    get().updateData({
      level: 0,
      running: true,
      startedAt: Date.now(),
    });
    // request full screen here
    // nosleep here
  },

  updateData(input: Partial<TimerData>) {
    const data = TimerData.partial().parse(input);
    const timerData = { ...get().timerData, ...data };
    set({ timerData });
    localSave("timer-data", timerData);
    if (get().sharing && !get().connecting) {
      console.log("askjdfhalskjdhflasjkdhflaskjdf");
      client.game.updateGame.mutate({ game: data });
    }
  },

  togglePlay() {
    const { updateData, timerData: data } = get();
    if (data.running) {
      updateData({ pausedAt: Date.now(), running: false });
      return;
    }
    updateData({
      pausedAt: null,
      running: true,
      startedAt:
        data.startedAt && data.pausedAt
          ? data.startedAt + Date.now() - data.pausedAt
          : null,
    });
  },

  doTick(goToConfig: () => void) {
    const {
      timerData: data,
      resetTimer,
      updateData,
      setSeconds,
      setMinutes,
      minutes,
      seconds,
    } = get();
    const levelData = data.levels[data.level];
    if (!levelData) {
      resetTimer();
      goToConfig();
      return;
    }

    const totalTime = getTotalTime(data.startedAt, levelData);
    if (totalTime < 0) {
      updateData({
        level: data.level + 1,
        startedAt: Date.now(),
      });
      return;
    }

    const [mins, secs] = getMinSecs(totalTime);
    if (mins !== minutes) setMinutes(mins);
    if (secs !== seconds) setSeconds(secs);
  },

  async startSharing() {
    set({ connecting: true });
    const { code } = await client.game.startSharing.mutate({
      game: get().timerData,
    });
    set({ code, connecting: false, sharing: true });
    localSave("game-code", code);
    localSave("is-sharing", true);
  },
}));

function getInitialTimerData() {
  const parsedData = TimerData.safeParse(localLoad("timer-data"));
  if (parsedData.success) return parsedData.data;
  return getDefaultTimerData();
}

function getTotalTime(startedAt: number | null, level: Level | Break) {
  const roundTime = level.duration * 60_000;
  const elapsedTime = Date.now() - (startedAt ?? 0);
  return roundTime - elapsedTime;
}

function getMinSecs(totalTime: number): [number, number] {
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor(totalTime / 1000) % 60;
  return [minutes, seconds];
}
