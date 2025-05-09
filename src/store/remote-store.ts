import { create } from "zustand";
import { GameLevels } from "@/schemas";
import { useUiStore } from "@/store/ui-store";
// import { localLoad, localSave } from "@/lib/storage-utils";
import client from "@/rpc/rpc-client";

interface RemoteState {
  connecting: boolean;
  connection?: WebSocket;
  running: boolean;
  // remoteId: string;
  level: number;
  startedAt: number | null;
  pausedAt: number | null;
  levels: GameLevels;
}

interface RemoteActions {
  connect: (code: string) => void;
  changeLevel: (level: number) => void;
  notifyDisconnected: () => void;
}

type RemoteStoreState = RemoteState & RemoteActions;
export const useRemoteStore = create<RemoteStoreState>((set, get) => ({
  connection: undefined,
  connecting: false,
  // remoteId: localLoad("remote-id") || "",
  running: false,
  level: 0,
  startedAt: null,
  pausedAt: null,
  levels: [],

  connect(code: string) {
    if (get().connection || get().connecting) return;

    client.remote.connectToGame.subscribe(
      { code },
      {
        onData: (game) => {
          const connected =
            game.connected !== undefined ? { connected: game.connected } : {};

          const level = game.level ? { level: game.level } : {};

          const levels = game.levels ? { levels: JSON.parse(game.levels) } : {};

          const pausedAt = game.pausedAt
            ? { pausedAt: new Date(game.pausedAt).getTime() }
            : {};

          const running =
            game.running !== undefined ? { running: game.running } : {};

          const startedAt = game.startedAt
            ? { startedAt: new Date(game.startedAt).getTime() }
            : {};

          const update = {
            ...connected,
            ...level,
            ...levels,
            ...startedAt,
            ...pausedAt,
            ...running,
          };

          set(update);
        },

        onError(err) {
          useUiStore
            .getState()
            .notify(err.message ?? "Error", { kind: "error" });
        },

        // onConnectionStateChange(state) {
        //   console.log("*******************");
        //   console.log(state);
        //   useUiStore.getState().notify("asdfasdfasdf", { kind: "error" });
        // },

        onStopped() {
          useUiStore.getState().notify("STOPPED", { kind: "error" });
        },
      },
    );
  },

  changeLevel(level: number) {
    set({ level });
  },

  notifyDisconnected() {
    useUiStore.getState().notify("You're device is disconnected", {
      kind: "error",
      duration: 5,
    });
  },
}));
