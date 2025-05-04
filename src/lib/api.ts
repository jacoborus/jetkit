import { GameLevels } from "@/schemas";
// import { localLoad, localSave } from "./storage-utils";

export interface GameConfig {
  id: string;
  name: string;
  levels: GameLevels;
  with_ante: boolean;
  lock_level_duration: boolean;
  base_break_duration: number;
  base_level_duration: number;
}

export interface SharedDisplay {
  id: string;
  user_created: string;
  code: string;
  active: boolean;
  connected: boolean;
  running: boolean;
  level: number;
  levels: GameLevels;
  startedAt: number;
  pausedAt: number;
}

export interface RemoteDisplay {
  id: string;
  name: string;
  connected: boolean;
  shared_display: string;
}
