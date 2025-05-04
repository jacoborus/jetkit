import { WebSocketServer } from "ws";

import * as service from "../remote/remote-service";
import * as deviceService from "src/device/device-service";
import { wsGuestMiddleware } from "./remote-middleware";
import { DeviceUpdateSchema } from "src/device/device-schemas";
import { emitRemoteUpdate } from "../remote/remote-service";

const sock = new WebSocketServer({ noServer: true });

sock.on("connection", (conn) => {
  const credentials = {
    id: "",
    name: "",
    sharedDevice: "",
  };

  const loginTimer = setTimeout(() => {
    conn.close();
  }, 5000);

  conn.once("message", async (msg) => {
    const {
      remoteId,
      name: remoteName,
      sharedDevice,
      error,
    } = await wsGuestMiddleware(msg.toString());

    if (!remoteId || error) {
      conn.send(error || "Cannot authenticate");
      return conn.close();
    }

    clearTimeout(loginTimer);

    credentials.id = remoteId;
    credentials.sharedDevice = sharedDevice;
    credentials.name = remoteName;

    conn.send(JSON.stringify({ kind: "auth", data: remoteId }));

    await service.update(credentials.id, { connected: true });

    const device = await deviceService.getById(sharedDevice);

    const parsedDevice = DeviceUpdateSchema.parse(device);

    conn.send(
      JSON.stringify({
        kind: "updatedDevice",
        data: parsedDevice,
      }),
    );

    if (device) {
      emitRemoteUpdate(device.id, {
        id: remoteId,
        name: remoteName,
        connected: true,
        sharedDevice,
      });
    }

    const removeTrigger = deviceService.onDeviceUpdate(sharedDevice, (data) => {
      conn.send(
        JSON.stringify({
          kind: "updatedDevice",
          data,
        }),
      );
    });

    conn.on("close", removeTrigger);
  });

  conn.on("close", async () => {
    if (!credentials.id) return;
    console.log("Closing device connection");
    await service.update(credentials.id, { connected: false });
  });
});

export const remoteSocket = sock;
