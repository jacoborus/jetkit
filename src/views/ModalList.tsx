import { Info, CircleX, CircleCheckBig } from "lucide-react";

import { useUiStore } from "@/store/ui-store";
import PopUp from "@/components/PopUp";

export default function ModalList() {
  const { modals, removeModal } = useUiStore();

  return (
    <div className="modals-list">
      {modals.map((m) => (
        <PopUp
          key={m.id}
          {...m}
          isOpen={true}
          close={() => removeModal(m.id)}
        >
          <IconType type={m.kind} />
          <h1 className="text-lg">{m.title}</h1>
          <p>{m.message}</p>
        </PopUp>
      ))}
    </div>
  )
}

function IconType({ type }: { type: 'info' | 'error' | 'success' }) {
  if (type === 'info') return <Info />
  if (type === 'error') return <CircleX />
  if (type === 'success') return <CircleCheckBig />
}
