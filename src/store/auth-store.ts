import { defineStore } from "pinia";

import router from "@/router";
import { localLoad, localSave } from "@/util";
import { useUiStore } from "./ui-store";
import { authClient } from "@/auth/auth-client";

interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthStoreState {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: string;
  };
  isRefreshing: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthStoreState => {
    return {
      isLoggedIn: localLoad("isLoggedIn") || false,
      user: {
        id: "",
        email: "",
        name: "",
        image: null,
        role: "",
      },
      isRefreshing: false,
    };
  },

  getters: {
    isAdmin: (state) => {
      return state.user.role === "admin";
    },
  },

  actions: {
    async init() {
      if (this.isLoggedIn) {
        const { data, error } = await authClient.getSession();
        if (error) {
          return;
        }
        this.user.id = data.user.id;
        this.user.email = data.user.email;
        this.user.name = data.user.name;
        this.user.role = data.user.role || "user";
        this.user.image = data.user.image;
      }
    },

    async singIn(credentials: LoginRequest) {
      const { data, error } = await authClient.signIn.email(
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              useUiStore().notify("Please verify your email address", {
                kind: "error",
              });
              return;
            }
            useUiStore().notify(ctx.error.message, { kind: "error" });
          },
        },
      );

      if (error) {
        this.setLoggedOut();
        return false;
      }

      this.setLoggedIn(data.user);
      return true;
    },

    setLoggedIn(user: { id: string; email: string }) {
      this.user.id = user.id;
      this.user.email = user.email;
      this.isLoggedIn = true;
      localSave("isLoggedIn", true);
    },

    setLoggedOut() {
      this.isLoggedIn = false;
      localSave("isLoggedIn", false);
      this.user = {
        id: "",
        email: "",
        name: "",
        image: null,
        role: "",
      };
    },

    async singOut() {
      await authClient.signOut();
      this.setLoggedOut();
      useUiStore().notify("You've been disconnected");
      router.push("/sign-in");
    },

    async requestPasswordReset(email: string) {
      await authClient.forgetPassword({ email });
    },

    async signUp(payload: UserCreateRequest) {
      return await authClient.signUp.email(payload);
    },
  },
});
