import { create } from "zustand";
import { generateId } from "@/lib/util";
import { getQuickRounds } from "@/pages/QuickConfPage";
import { localLoad, localSave } from "@/lib/storage-utils";
import { client } from "@/rpc/rpc-client";
import {
  Break,
  CustomConf,
  GameLevels,
  getDefaultCustomConf,
  getDefaultQuickConf,
  Level,
} from "../schemas";

interface State {
  levels: GameLevels;
  conf: CustomConf;
  newLevel?: Level;
  selectedLevel?: Level;
  selectedBreak?: Break;
  newBreak?: Break;
  addBreaksOpen?: boolean;
  configID?: string;
}

interface Actions {
  saveLevels: (levels: GameLevels) => void;
  clearLevels: () => void;
  addLevel: (level: Level) => void;
  editLevel: (level: Level) => void;
  setSelectedLevel: (level?: Level) => void;
  setNewLevel: (level?: Level) => void;
  setNewBreak: (breakk?: Break) => void;
  setSelectedBreak: (breakk?: Break) => void;
  updateConf: <K extends keyof CustomConf>(
    key: K,
    value: CustomConf[K],
  ) => void;
  addBreak: (id: string, position: number, duration: number) => void;
  editBreak: (id: string, position: number, duration: number) => void;
  addBreaks: (interval: number, duration: number) => void;
  saveConfig: () => void;
  loadConfig: () => void;
  getConfigId: () => void;
}

export const useCustomStore = create<State & Actions>((set, get) => ({
  levels: getInitialLevels(),
  conf: getInitialConf(),
  selectedLevel: undefined,
  selectedBreak: undefined,
  newBreak: undefined,

  updateConf: (key: keyof CustomConf, value: CustomConf[typeof key]) => {
    const { saveLevels, levels } = get();
    const newConf = { ...get().conf, [key]: value };
    set({ conf: newConf });
    localSave("custom-conf", newConf);
    if (key === "baseLevelDuration") {
      saveLevels(
        levels.map((l) =>
          l.type === "game" ? { ...l, duration: value as number } : l,
        ),
      );
    }
  },

  findlevel: (id: string) => get().levels.find((l) => l.id === id),

  saveLevels(levels: GameLevels) {
    set({ levels });
    localSave("custom-levels", levels);
  },

  clearLevels() {
    set({ levels: [] });
  },

  setNewLevel(level?: Level) {
    set({ newLevel: level });
  },

  setNewBreak(breakk?: Break) {
    set({ newBreak: breakk });
  },

  addLevel: (level: Level) => {
    const levels = get().levels;
    const position = levels.findIndex(
      (r) => r.type === "game" && r.blinds[0] > level.blinds[0],
    );
    get().saveLevels([
      ...levels.slice(0, position),
      level,
      ...levels.slice(position),
    ]);
    get().setSelectedLevel(undefined);
  },

  editLevel: (level: Level) => {
    const otherLevels = get().levels.filter((l) => l.id !== level.id);
    const position = otherLevels.findIndex(
      (r) => r.type === "game" && r.blinds[0] > level.blinds[0],
    );
    set({
      levels: [
        ...otherLevels.slice(0, position),
        level,
        ...otherLevels.slice(position),
      ],
    });
    get().setSelectedLevel(undefined);
  },

  setSelectedLevel(level?: Level) {
    set({ selectedLevel: level });
  },

  setSelectedBreak(breakk?: Break) {
    set({ selectedBreak: breakk });
  },

  addBreak: (id: string, position: number, duration: number) => {
    const store = get();
    const breakk: Break = { id, duration, type: "break" };
    const levels = store.levels;
    store.saveLevels([
      ...levels.slice(0, position),
      breakk,
      ...levels.slice(position),
    ]);
    set({ newBreak: undefined });
  },

  editBreak: (id: string, position: number, duration: number) => {
    const store = get();
    const otherLevels = store.levels.filter((l) => l.id !== id);
    const breakk: Break = { id, duration, type: "break" };
    const oldPosition = store.levels.findIndex((l) => l.id === id);
    const pos = position <= oldPosition ? position : position - 1;
    store.saveLevels([
      ...otherLevels.slice(0, pos),
      breakk,
      ...otherLevels.slice(pos),
    ]);
    set({ selectedBreak: undefined });
  },

  addBreaks: (interval: number, duration: number) => {
    const { levels } = get();
    const gameLevels = levels.filter((l) => l.type === "game");
    const newLevels: GameLevels = [];
    gameLevels.forEach((level, i) => {
      newLevels.push(level);
      if ((i + 1) % interval === 0) {
        newLevels.push({ id: generateId(), type: "break", duration });
      }
    });
    set({ levels: newLevels, addBreaksOpen: false });
  },

  saveConfig: async () => {
    const { levels, conf, configID } = get();
    if (configID) {
      return await client.preset.updatePreset.mutate({
        id: configID,
        levels: JSON.stringify(levels),
        ...conf,
      });
    }
    return await client.preset.createPreset
      .mutate({
        name: "default",
        levels: JSON.stringify(levels),
        ...conf,
      })
      .then((data) => {
        if (!data) return;
        set({ configID: data.id });
      });
  },

  loadConfig: async () => {
    const data = await client.preset.listOwnPresets.query();
    if (!data) return;
    const game = data[0];
    if (game) {
      const { data: levels, success } = GameLevels.safeParse(
        JSON.parse(game.levels),
      );
      if (!success) {
        console.log("Error parsing levels");
        return;
      }
      const conf = {
        withAnte: game.withAnte,
        lockLevelDuration: game.lockLevelDuration,
        baseBreakDuration: game.baseBreakDuration,
        baseLevelDuration: game.baseLevelDuration,
      };
      set({
        configID: game.id,
        levels,
        conf: conf,
      });
      localSave("custom-conf", conf);
      localSave("custom-levels", levels);
    }
  },

  getConfigId: async () => {
    const data = await client.preset.listOwnPresets.query();
    if (!data) return;
    const game = data[0];
    if (game) {
      const { data: levels, success } = GameLevels.safeParse(
        JSON.parse(game.levels),
      );
      if (!success) {
        console.log("Error parsing levels");
        return;
      }
      const conf = {
        withAnte: game.withAnte,
        lockLevelDuration: game.lockLevelDuration,
        baseBreakDuration: game.baseBreakDuration,
        baseLevelDuration: game.baseLevelDuration,
      };
      set({
        configID: game.id,
        levels: levels,
        conf: conf,
      });
      localSave("custom-conf", conf);
      localSave("custom-levels", levels);
    }
    if (game) set({ configID: game.id });
  },
}));

function getInitialConf() {
  const savedCustomConf = localLoad("custom-conf");
  const parsedConf = CustomConf.safeParse(savedCustomConf);
  return parsedConf.success ? parsedConf.data : getDefaultCustomConf();
}

function getInitialLevels() {
  const savedLevels = localLoad("custom-levels");
  const parsedLevels = GameLevels.safeParse(savedLevels);
  return parsedLevels.success
    ? parsedLevels.data
    : getQuickRounds(getDefaultQuickConf());
}
