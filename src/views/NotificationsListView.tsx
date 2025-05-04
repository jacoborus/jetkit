import { Info, CircleX, CircleCheckBig, XIcon } from "lucide-react";

import { useUiStore } from "@/store/ui-store";

export default function NotificationsList() {
  const { notifications, removeNotification } = useUiStore();

  return (
    <div className="notifications-list">
      {notifications.map((n) => (
        <div key={n.id} role="alert" className={`alert alert-${n.kind} m-4`}>
          <IconType type={n.kind} />
          <span className="text-base">{n.message}</span>
          {n.showCloseButton && (
            <button onClick={() => removeNotification(n.id)} className="btn btn-sm btn-ghost">
              <XIcon size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function IconType({ type }: { type: 'info' | 'error' | 'success' }) {
  if (type === 'info') return <Info />
  if (type === 'error') return <CircleX />
  if (type === 'success') return <CircleCheckBig />
}
