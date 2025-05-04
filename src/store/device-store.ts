import { create } from "zustand";

import { localLoad, localSave } from "@/lib/storage-utils";
import { TimerData } from "@/schemas";
import { useUiStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { useGameStore } from "./game-store";

interface MainDeviceState {
  code: string;
  sharing: boolean;
}

export interface RemoteDisplay {
  id: string;
  name: string;
  connected: boolean;
}

interface DeviceState extends MainDeviceState {
  connecting: boolean;
  connection?: WebSocket;
  remotes: RemoteDisplay[];
}

interface DeviceActions {
  init: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  startSharing: () => Promise<void>;
  stopSharing: () => Promise<void>;
  renameRemote: (remoteId: string, newName: string) => void;
  updateDevice: (data: Partial<TimerData>) => void;
  updateData: (data: Partial<DeviceState>) => void;
  updateDeviceInfo: (data: Partial<DeviceState>) => Promise<void>;
  notifySharing: () => void;
  notifyDisconnected: () => void;
  notifyNewRemote: (remote: RemoteDeviceState) => void;
  notifyRemoteDestroy: (remote: RemoteDeviceState) => void;
}

function loadLocalData() {
  const data = localLoad<MainDeviceState>("device-data");
  if (!data) return { sharing: false };
  return {
    code: data.code,
    sharing: data.sharing,
  };
}

export const useDeviceStore = create<DeviceState & DeviceActions>(
  (set, get) => ({
    ...loadLocalData(),
    connection: undefined,
    connecting: false,
    remotes: [],
    code: "",

    async init() {
      if (get().sharing) await get().connect();
    },

    updateData(data: Partial<DeviceState>) {
      set(data);
      const { code, sharing } = get();
      localSave("device-data", { code, sharing });
    },

    async connect() {
      const { connecting, connection } = get();
      if (connecting || connection) return;

      const token = useAuthStore.getState().getToken();
      if (!token) throw Error("User not authenticated");
      const conn = new WebSocket(`${import.meta.env.VITE_WS_URL}/device`);
      set({ connecting: true });

      conn.addEventListener("open", function () {
        const creds = { kind: "login", data: token };
        conn.send(JSON.stringify(creds));
      });

      conn.addEventListener("close", function () {
        set({ connecting: false, connection: undefined, sharing: false });
        get().notifyDisconnected();
      });

      conn.addEventListener("message", function (msg) {
        let data;
        try {
          data = JSON.parse(msg.data);
        } catch (e) {
          console.error(e);
          console.error(msg.data);
          return;
        }

        if (data.type === "ping") {
          conn.send(JSON.stringify({ type: "pong" }));
          return;
        }

        if (data.kind === "auth") {
          if (!data.data) return conn.close();
          set({ connection: conn, connecting: false });
          get().startSharing();
          return;
        }

        if (data.kind === "startedSharing") {
          if (!data.code) return;
          get().updateData({ sharing: true, code: data.code as string });
          get().notifySharing();
          conn.send(JSON.stringify({ kind: "getRemotes" }));
          return;
        }

        // if (data.kind === "addedRemote") {
        //   if (!data.data) return;
        //   const remote = data.data as RemoteDeviceState;
        //   set({ remotes: [...get().remotes, remote] });
        //   get().notifyNewRemote(remote);
        //   return;
        // }

        // if (data.kind === "removedRemote") {
        //   if (!data.data) return;
        //   const remoteId = data.data as string;
        //   const remote = get().remotes.find((r) => r.id === remoteId);
        //   if (!remote) return;
        //   set({ remotes: get().remotes.filter((r) => r.id !== remoteId) });
        //   get().notifyRemoteDestroy(remote);
        //   return;
        // }

        if (data.kind === "updatedRemote") {
          if (!data.data) return;
          const remote = data.data as RemoteDeviceState;
          const oldRemote = get().remotes.find((r) => r.id === remote.id);
          if (oldRemote) {
            set({
              remotes: get().remotes.map((r) =>
                r.id === remote.id ? remote : r,
              ),
            });
            if (oldRemote.connected && !remote.connected) {
              get().notifyRemoteDestroy(remote);
              return;
            }
            if (!oldRemote.connected && remote.connected) {
              get().notifyNewRemote(remote);
              return;
            }
            return;
          }
          set({ remotes: [...get().remotes, remote] });
          get().notifyNewRemote(remote);
          return;
        }

        if (data.kind === "remotes") {
          if (!data.data) return;
          set({ remotes: data.data });
          return;
        }

        console.log("unknown message: ");
        console.log(data);
      });
    },

    disconnect() {
      const conn = get().connection;
      if (conn) conn.close();
      set({ connecting: false, connection: undefined, sharing: false });
    },

    async startSharing() {
      console.log("init start sharing");
      const connection = get().connection;
      if (!connection) return;
      set({ connection: connection });
      connection.send(
        JSON.stringify({
          kind: "startSharing",
          data: useGameStore.getState().timerData,
        }),
      );
    },

    async stopSharing() {
      get().connection?.close();
      get().updateData({
        sharing: false,
        connecting: false,
        connection: undefined,
      });
    },

    renameRemote(remoteId: string, newName: string) {
      const { connecting, connection } = get();
      if (connecting || !connection) return;
      connection.send(
        JSON.stringify({ kind: "renameRemote", data: { remoteId, newName } }),
      );
    },

    async updateDeviceInfo(data: Partial<DeviceState>) {
      set(data);
      const { code, sharing } = get();
      localSave("device-data", {
        code,
        sharing,
      });
    },

    async updateDevice(data: Partial<TimerData>) {
      const { connecting, connection } = get();
      if (connecting || !connection) return;
      connection.send(
        JSON.stringify({
          kind: "updateDevice",
          data,
        }),
      );
    },

    notifySharing() {
      useUiStore
        .getState()
        .addNotification("You're sharing the game: " + get().code, {
          kind: "success",
          duration: 0,
        });
    },

    notifyDisconnected() {
      useUiStore.getState().addNotification("You're device is disconnected", {
        kind: "error",
        duration: 5,
      });
    },

    notifyNewRemote(remote: RemoteDeviceState) {
      useUiStore
        .getState()
        .addNotification("New remote display: " + remote.name, {
          kind: "success",
          duration: 5,
        });
    },

    notifyRemoteDestroy(remote: RemoteDeviceState) {
      useUiStore
        .getState()
        .addNotification(
          "Remote display disconnected: " + remote.name || remote.id,
          {
            kind: "info",
            duration: 5,
          },
        );
    },
  }),
);

interface RemoteDeviceState {
  id: string;
  name: string;
  connected: boolean;
}
