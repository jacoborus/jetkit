import { create } from "zustand";
import { useUiStore } from "./ui-store";
import { localLoad, localSave } from "@/lib/storage-utils";
import { authClient } from "@/lib/auth-client";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    language: string;
  };
}

interface AuthActions {
  init: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  // readMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLoggedIn: localLoad("isLoggedIn") || false,
  user: {
    id: "",
    email: "",
    name: "",
    language: "",
  },

  async init() {
    console.log("authStore init");
  },

  async signIn(email: string, password: string) {
    return authClient.signIn
      .email({ email, password })
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message);
        }
        return data.user;
      })
      .then((me) => {
        set({
          isLoggedIn: true,
          user: {
            id: me.id || "",
            email: me.email || "",
            name: me.name || "",
            language: "en",
            // language: me.language || "",
          },
        });
        localSave("isLoggedIn", true);

        useUiStore.getState().notify(`Welcome back ${me.name || ""}!`);
        return true;
      })
      .catch(() => {
        useUiStore.getState().notify("Invalid credentials", { kind: "error" });
        set({ isLoggedIn: false });
        return false;
      });
  },

  async signOut() {
    await authClient.signOut();
    set({ isLoggedIn: false });
    localSave("isLoggedIn", false);
    useUiStore
      .getState()
      .notify("You have been logged out", { kind: "success" });
  },

  async signUp(email: string, password: string, name: string) {
    return authClient.signUp
      .email({ email, password, name })
      .then(({ error }) => {
        console.log(error);
        if (error) throw new Error("Wrong credentials");
        return true;
      })
      .catch(() => {
        useUiStore.getState().notify("Invalid credentials", { kind: "error" });
        return false;
      });
  },

  // async readMe() {
  //   return api
  //     .request(
  //       readMe({
  //         fields: ["id", "email", "first_name", "last_name", "language"],
  //       }),
  //     )
  //     .then((me) => {
  //       set({
  //         isLoggedIn: true,
  //         user: {
  //           id: me.id || "",
  //           email: me.email || "",
  //           first_name: me.first_name || "",
  //           last_name: me.last_name || "",
  //           language: me.language || "",
  //         },
  //       });
  //       useUiStore
  //         .getState()
  //         .addNotification(`Welcome back ${me.first_name || ""}!`);
  //     });
  // },
}));
