import { ReactNode, useRef } from "react";

import NotificationsList from "@/views/NotificationsListView";
import { NavBar } from "@/views/NavBar";
import ModalList from "./ModalList";

export default function UiWrapper({ children }: { children: ReactNode }) {
  const clockAppRef = useRef<HTMLDivElement>(null);

  return (
    <div className="ui-wrapper bg-base-100" ref={clockAppRef}>
      {clockAppRef && <NavBar clockAppRef={clockAppRef} />}
      {children}
      <ModalList />
      <NotificationsList />
    </div>
  );
}
