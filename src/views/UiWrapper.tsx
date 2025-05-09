import { useEffect, ReactNode, useRef } from "react";

import { useAuthStore } from "@/store/auth-store";
import NotificationsList from "@/views/NotificationsListView";
import { NavBar } from "@/views/NavBar";
import ModalList from "./ModalList";
// import { useDeviceStore } from "@/store/device-store";

export default function UiWrapper({ children }: { children: ReactNode }) {
  const clockAppRef = useRef<HTMLDivElement>(null);
  const authStore = useAuthStore();
  // const deviceStore = useDeviceStore();

  useEffect(() => {
    authStore.init();
    //   .then(yes => {
    // if (yes) deviceStore.init()
    // })
  }, []); // eslint-disable-line

  return (
    <div className="ui-wrapper bg-base-100" ref={clockAppRef}>
      {clockAppRef !== null && <NavBar clockAppRef={clockAppRef} />}
      {children}
      <ModalList />
      <NotificationsList />
    </div>
  );
}
