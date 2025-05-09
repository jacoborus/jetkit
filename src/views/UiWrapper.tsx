import { ReactNode, useRef, RefObject } from "react";

import NotificationsList from "@/views/NotificationsListView";
import { NavBar } from "@/views/NavBar";
import ModalList from "./ModalList";

export default function UiWrapper({ children }: { children: ReactNode }) {
  const clockAppRef = useRef<HTMLDivElement>(null);
  const cc = clockAppRef as RefObject<HTMLDivElement>

  return (
    <div className="ui-wrapper bg-base-100" ref={clockAppRef}>
      {clockAppRef !== null && <NavBar clockAppRef={cc} />}
      {children}
      <ModalList />
      <NotificationsList />
    </div>
  );
}
