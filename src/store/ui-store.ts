import { defineStore } from "pinia";

interface Notification {
  id: string;
  message: string;
  kind: "info" | "error" | "success";
  duration: number;
  showCloseButton: boolean;
  timeoutId?: number;
}

interface ModalData {
  id: string;
  title: string;
  message: string;
  kind: "info" | "error" | "success";
  showCloseButton: boolean;
  buttons: {
    name: string;
    onClick: (close: () => void) => void;
  }[];
  cancelText?: string;
  showCancelButton?: boolean;
}

interface Confirmation {
  id: string;
  title: string;
  message: string;
  kind: "info" | "error" | "success";
  yesCaption?: string;
  noCaption?: string;
}

interface UiState {
  notifications: Notification[];
  modals: ModalData[];
}

interface AddNotificationOpts {
  kind?: "info" | "error" | "success";
  duration?: number;
  showCloseButton?: boolean;
}

export const useUiStore = defineStore("ui", {
  state: (): UiState => ({
    notifications: [],
    modals: [],
  }),

  actions: {
    notify(message: string, opts?: AddNotificationOpts) {
      const notification = createNotificationData(message, opts);
      this.notifications.push(notification);
      if (notification.duration) {
        notification.timeoutId = setTimeout(
          () => this.removeNotification(notification.id),
          4000,
        ) as unknown as number;
      }
    },

    removeNotification(id: string) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification?.timeoutId) clearTimeout(notification.timeoutId);
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },

    addModal(opts: Partial<ModalData>) {
      const modal = createModalData(opts);
      this.modals.push(modal);
    },

    removeModal(id: string) {
      this.modals = this.modals.filter((n) => n.id !== id);
    },

    confirm(opts: Partial<Confirmation>) {
      return new Promise<boolean>((resolve) => {
        const data = createModalData({
          ...opts,
          buttons: [
            {
              name: opts.yesCaption ?? "Yes",
              onClick: (close) => {
                close();
                resolve(true);
              },
            },
            {
              name: opts.noCaption ?? "No",
              onClick: (close) => {
                close();
                resolve(false);
              },
            },
          ],
        });
        this.addModal(data);
      });
    },
  },
});

function createNotificationData(
  message: string,
  opts = {} as AddNotificationOpts,
): Notification {
  const duration = opts.duration ?? 4000;
  return {
    id: crypto.randomUUID(),
    message,
    kind: opts.kind ?? "info",
    duration,
    showCloseButton: !duration || (opts.showCloseButton ?? false),
  };
}

function createModalData(opts: Partial<ModalData>): ModalData {
  return {
    id: crypto.randomUUID(),
    title: opts.title ?? "",
    message: opts.message ?? "",
    kind: opts.kind ?? "info",
    showCloseButton: opts.showCloseButton ?? false,
    buttons: opts.buttons ?? [],
    cancelText: "",
    showCancelButton: opts.showCancelButton ?? false,
  };
}
