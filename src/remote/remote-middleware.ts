import * as remoteService from "./remote-service";
import z from "zod";

export async function wsGuestMiddleware(
  msg: string,
): Promise<GuestLoginResponse> {
  const { data, error } = parseGuestLogin(msg);
  if (!data || error) {
    return { error: "Incorrect credentials format" };
  }

  const { remote, error: err } = await remoteService.generateRemote(
    data.code,
    data.id,
  );
  if (!remote || err) return { error: err };

  return {
    name: remote.name,
    remoteId: remote.id,
    sharedDevice: remote.sharedDevice,
  };
}

function parseGuestLogin(msg: string) {
  let data: { code: string; id?: string };
  try {
    const parsed = JSON.parse(msg);
    data = GuestLoginMsg.parse(parsed);
  } catch (e) {
    console.log("error parsing message");
    console.log(e);
    return { error: true };
  }
  return { data };
}

export const GuestLoginResponse = z.union([
  z.object({
    remoteId: z.string(),
    name: z.string(),
    sharedDevice: z.string(),
    error: z.undefined(),
  }),
  z.object({
    remoteId: z.undefined(),
    name: z.undefined(),
    sharedDevice: z.undefined(),
    error: z.string(),
  }),
]);
export type GuestLoginResponse = z.infer<typeof GuestLoginResponse>;

const GuestLoginMsg = z.object({
  code: z.string(),
  id: z.string().optional(),
});
