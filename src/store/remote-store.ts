import { create } from "zustand";
import { GameLevels } from "@/schemas";
import { useUiStore } from "./ui-store";
import { localLoad, localSave } from "@/lib/storage-utils";

interface RemoteState {
  connecting: boolean;
  connection?: WebSocket;
  running: boolean;
  remoteId: string;
  level: number;
  startedAt: number;
  pausedAt: number;
  levels: GameLevels;
}

interface RemoteActions {
  connect: (code: string) => void;
  changeLevel: (level: number) => void;
  notifyDisconnected: () => void;
}

const url = `${import.meta.env.VITE_WS_URL}/remote`;

type RemoteStoreState = RemoteState & RemoteActions;
export const useRemoteStore = create<RemoteStoreState>((set, get) => ({
  connection: undefined,
  connecting: false,
  remoteId: localLoad("remote-id") || "",
  running: false,
  level: 0,
  startedAt: 0,
  pausedAt: 0,
  levels: [],

  connect(code: string) {
    if (get().connection || get().connecting) return;
    set({ connecting: true });
    const connection = new WebSocket(url);

    connection.addEventListener("open", function () {
      connection.send(
        JSON.stringify({ type: "subscribe", code, id: get().remoteId }),
      );
    });

    connection.addEventListener("close", function () {
      console.log("==== on close ====");
      set({ connection: undefined, connecting: false });
      get().notifyDisconnected();
    });

    connection.addEventListener("message", function (message) {
      const data = JSON.parse(message.data);

      if (data.kind === "auth") {
        localSave("remote-id", data.data);
        return;
      }

      if (data.type === "ping") {
        connection.send(JSON.stringify({ type: "pong" }));
        return;
      }

      if (data.kind === "updatedDevice") {
        const levels = data.data.levels
          ? { levels: JSON.parse(data.data.levels) }
          : {};

        const started = data.data.startedAt
          ? { startedAt: new Date(data.data.startedAt).getTime() }
          : {};

        const paused = data.data.pausedAt
          ? { pausedAt: new Date(data.data.pausedAt).getTime() }
          : {};

        set({ ...data.data, ...levels, started, paused });
        return;
      }

      console.log("===== unknown message =====");
      console.log(data);
    });
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
