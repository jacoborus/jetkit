import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
import { useAuthStore } from "@/store/auth-store";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [adminClient()],
  basePath: "/auth",
  fetchOptions: {
    onError: async ({ response }) => {
      if (response.status === 401) {
        await useAuthStore().singOut();
      }
    },
  },
});
