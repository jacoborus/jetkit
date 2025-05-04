import { useEffect, useState } from "react";
import { getLevel, Level } from "@/schemas";
import PopUp from "@/components/PopUp";
import EditLevel from "@/config/EditLevel";

interface EditLevelModalProps {
  title: string;
  buttonText: string;
  target?: Level;
  save: (level: Level) => void;
  close: () => void;
}

export function EditLevelModal({
  target,
  close,
  buttonText,
  save,
  title,
}: EditLevelModalProps) {
  const [level, setLevel] = useState<Level>(getLevel);

  const buttons: [{ name: string; onClick: () => void }] = [
    {
      name: buttonText,
      onClick: () => {
        save(level);
        close();
      },
    },
  ];

  useEffect(() => {
    setLevel(getLevel(target));
  }, [target]);

  return (
    <div>
      <PopUp buttons={buttons} isOpen={!!target} close={close}>
        <h3 className="font-bold text-lg">{title}</h3>
        <EditLevel level={level} change={setLevel} />
      </PopUp>
    </div>
  );
}
