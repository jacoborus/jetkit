import type { Break, GameLevels, Level } from "../schemas";
import Digit from "@/components/AllDigits";
import { formatMoney } from "@/lib/storage-utils";
import { useGameStore } from "@/store/game-store";

export interface IBlindsView {
  levels: GameLevels;
  idx: number;
}

function isBreak(item: Level | Break): item is Break {
  return item.type === "break";
}

function isRound(item: Level | Break): item is Level {
  return item.type === "game";
}

function getWord(word: string) {
  return word.split("").map((n, i) => <Digit key={`${i}-${n}`} char={n} />);
}

export default function BlindsView() {
  const { timerData } = useGameStore();
  const { level: idx } = timerData;
  const level = timerData.levels[idx];
  if (!level) return <div>No more levels</div>;
  if (isBreak(level)) return getWord("Break");
  if (isRound(level)) {
    const [small, big] = level.blinds;
    return (
      <div className="flex flex-col">
        <span className="flex hola">{getWord(`b${formatMoney(small)}`)}</span>
        <span className="hidden sm:flex">{getWord("/")}</span>
        <span className="flex hola">{getWord(`b${formatMoney(big)}`)}</span>
      </div>
    );
  } else return <div>Invalid level</div>;
}
