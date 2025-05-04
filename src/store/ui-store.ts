import { create } from "zustand";

interface Notification {
  id: string;
  message: string;
  kind: "info" | "error" | "success";
  duration: number;
  showCloseButton: boolean;
  timeoutId?: NodeJS.Timeout;
}

interface ModalData {
  id: string;
  title: string;
  message: string;
  kind: "info" | "error" | "success";
  showCloseButton: boolean;
  buttons: { name: string; onClick: (close: () => void) => void }[];
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

interface UiActions {
  addNotification: (message: string, opts?: AddNotificationOpts) => void;
  removeNotification: (id: string) => void;
  addModal: (opts: Partial<ModalData>) => void;
  removeModal: (id: string) => void;
  confirm: (opts: Partial<Confirmation>) => Promise<boolean>;
}

interface AddNotificationOpts {
  kind?: "info" | "error" | "success";
  duration?: number;
  showCloseButton?: boolean;
}

export const useUiStore = create<UiState & UiActions>((set, get) => ({
  notifications: [],
  modals: [],

  addNotification: (message, opts?: AddNotificationOpts) => {
    const { removeNotification, notifications } = get();
    const notification = createNotificationData(message, opts);
    set({ notifications: [...notifications, notification] });
    if (notification.duration) {
      notification.timeoutId = setTimeout(
        () => removeNotification(notification.id),
        4000,
      );
    }
  },

  removeNotification: (id) => {
    const notification = get().notifications.find((n) => n.id === id);
    if (notification?.timeoutId) clearTimeout(notification.timeoutId);
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
    });
  },

  addModal: (opts: Partial<ModalData>) => {
    const { modals } = get();
    const modal = createModalData(opts);
    set({ modals: [...modals, modal] });
  },

  removeModal: (id) => {
    set({
      modals: get().modals.filter((n) => n.id !== id),
    });
  },

  confirm: (opts: Partial<Confirmation>) => {
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
      get().addModal(data);
    });
  },
}));

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
