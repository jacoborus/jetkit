import { useEffect, useState } from "react";
import { Break, GameLevels, getBreak } from "@/schemas";
import PopUp from "@/components/PopUp";
import { generateId } from "@/lib/util";
import EditBreak from "@/config/EditBreak";

interface EditBreakModalProps {
  title: string;
  buttonText: string;
  save: (id: string, position: number, duration: number) => void;
  breakk?: Break;
  levels: GameLevels;
  cancel: () => void;
}

export function EditBreakModal({
  save,
  breakk,
  cancel,
  buttonText,
  title,
  levels,
}: EditBreakModalProps) {
  const [duration, setDuration] = useState<number>(
    () => breakk?.duration || 15,
  );
  const [position, setPosition] = useState<number>(0);
  const [id, setId] = useState(breakk?.id || generateId());

  const buttons: [{ name: string; onClick: () => void }] = [
    {
      name: buttonText,
      onClick: () => {
        save(id, position, duration);
      },
    },
  ];

  useEffect(() => {
    if (!breakk) return;
    const newBreak = getBreak(breakk);
    setDuration(newBreak.duration);
    const newPosition = levels.findIndex((l) => l.id === breakk.id);
    setPosition(newPosition);
    setId(newBreak.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakk]);

  function change(pos: number, dur: number) {
    setPosition(pos);
    setDuration(dur);
  }

  return (
    <div>
      <PopUp buttons={buttons} isOpen={!!breakk} close={cancel}>
        <h3 className="font-bold text-lg">{title}</h3>
        {breakk && (
          <EditBreak
            duration={duration}
            position={position}
            levels={levels}
            change={change}
            id={id}
          />
        )}
      </PopUp>
    </div>
  );
}
