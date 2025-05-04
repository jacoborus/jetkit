import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { RpcRouter } from "@/rpc/rpc-router";

const client = createTRPCClient<RpcRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/rpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      // methodOverride: "POST",
    }),
  ],
});

export default client;

// console.log(await client.hello.query("Hono"));
