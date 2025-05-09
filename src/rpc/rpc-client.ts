import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { useNavigate } from "react-router";

import type { RpcRouter } from "@/rpc/rpc-router";
import { useAuthStore } from "@/store/auth-store";

const wsClient = createWSClient({ url: "ws://localhost:3001/rpc" });

export const client = createTRPCClient<RpcRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.type === "subscription",

      true: wsLink({ client: wsClient }),

      false: httpBatchLink({
        url: `${import.meta.env.VITE_BASE_URL}/rpc`,

        async fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          }).then((response) => {
            if (response.status === 401) {
              useAuthStore.getState().setLoggedOut();
              useNavigate()("/sign-in");
            }
            return response;
          });
        },
      }),
    }),
  ],
});

export default client;
