import { useGameStore } from "@/store/game-store";

export default function NextView() {
  const { timerData } = useGameStore();
  const nextLevel = timerData.levels[timerData.level + 1];
  if (!nextLevel) return null;
  if (nextLevel.type === "game") {
    return (
      <div>
        <h3>Next:</h3>
        <span className="text-xl">{nextLevel.duration} minutes</span>
        <h2>
          ${nextLevel.blinds[0]}/${nextLevel.blinds[1]}
        </h2>
      </div>
    );
  }
  return (
    <div>
      next:
      <span className="text-8xl font-mono font-bold">Break</span>
    </div>
  );
}
