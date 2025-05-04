import { padNumber } from "@/lib/util";
import Digit from "@/components/AllDigits";
import { useGameStore } from "@/store/game-store";

export default function TimerView() {
  const { minutes, seconds } = useGameStore();
  const formattedTime = `${padNumber(minutes)}:${padNumber(seconds)}`;

  return (
    <span className="flex">
      {formattedTime.split("").map((n, i) => (
        <Digit key={`${i}-${n}`} char={n} />
      ))}
    </span>
  );
}
