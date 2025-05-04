import { WebSocketServer, WebSocket } from "ws";
import z from "zod";

import * as service from "../device/device-service";
import { TimerData } from "../api/socket-messages";
import { wsAuthMiddleware } from "src/auth/auth-socket";
import * as remoteService from "src/remote/remote-service";

const SocketMsg = z.object({
  kind: z.string(),
  data: z.unknown(),
});
type SocketMsg = z.infer<typeof SocketMsg>;

const sock = new WebSocketServer({ noServer: true });

sock.on("connection", (conn) => {
  const credentials = {
    userId: "",
    role: "",
    deviceId: "",
  };

  const loginTimer = setTimeout(() => {
    conn.close();
  }, 10000);

  conn.once("message", async (msg) => {
    const { userId, error } = await wsAuthMiddleware(msg.toString());
    if (!userId || error) {
      conn.send(error || "Cannot authenticate");
      return conn.close();
    }

    clearTimeout(loginTimer);

    credentials.userId = userId;
    conn.send(JSON.stringify({ kind: "auth", data: true }));

    conn.on("message", async (message) => {
      const msg = JSON.parse(message.toString());

      const {
        data,
        error: err,
        deviceId,
      } = await deviceSocketHandler(credentials, msg, conn);

      if (err) return conn.send(JSON.stringify({ error: err }));
      if (data) conn.send(JSON.stringify(data));
      if (deviceId) credentials.deviceId = deviceId;
    });
  });

  conn.on("close", async () => {
    if (!credentials.userId) return;
    console.log("Closing device connection");
    await service.updateByUser(credentials.userId, { connected: false });
  });
});

export const deviceSocket = sock;

async function deviceSocketHandler(
  creds: { userId: string; deviceId: string },
  msg: SocketMsg,
  conn: WebSocket,
): Promise<{ error?: string; data?: unknown; deviceId?: string }> {
  if (msg.kind === "startSharing") {
    const { code, error } = await service.generateDevice(creds.userId);

    if (error) return { error: "Cannot generate device" };

    const timerData = TimerData.parse(msg.data);
    const { startedAt, pausedAt } = timerData;

    const device = await service.updateByUser(creds.userId, {
      startedAt: startedAt === 0 ? undefined : new Date(startedAt),
      pausedAt: pausedAt === 0 ? undefined : new Date(pausedAt),
      level: timerData.level,
      running: timerData.running,
      levels: JSON.stringify(timerData.levels),
    });

    const removeTrigger = remoteService.onRemoteUpdate(device.id, (data) => {
      conn.send(
        JSON.stringify({
          kind: "updatedRemote",
          data: {
            name: data.name,
            connected: data.connected,
            id: data.id,
          },
        }),
      );
    });

    conn.on("close", removeTrigger);

    return { data: { kind: "startedSharing", code }, deviceId: device.id };
  }

  if (msg.kind === "updateDevice") {
    const timerData = TimerData.partial().parse(msg.data);

    const levelsObj = timerData.levels
      ? { levels: JSON.stringify(timerData.levels) }
      : {};

    const newTimerData = {
      startedAt: timerData.startedAt
        ? new Date(timerData.startedAt)
        : undefined,
      pausedAt: timerData.pausedAt ? new Date(timerData.pausedAt) : undefined,
      running: timerData.running,
      level: timerData.level,
      ...levelsObj,
    };

    await service.updateByUser(creds.userId, newTimerData);
    return {};
  }

  if (msg.kind === "getRemotes") {
    if (!creds.deviceId) return {};
    const remotes = await remoteService.listBySharedDevice(creds.deviceId);
    return { data: { kind: "remotes", data: remotes } };
  }

  if (msg.kind === "renameRemote") {
    const { remoteId, newName } = RemoteRenameMsg.parse(msg.data);
    remoteService.update(remoteId, { name: newName });
    return {};
  }

  return { error: "Unknown message" };
}

const RemoteRenameMsg = z.object({
  remoteId: z.string(),
  newName: z.string(),
});
