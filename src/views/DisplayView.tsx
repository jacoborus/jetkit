import BlindsView from "@/views/BlindsView";
import NextView from "@/views/NextView";
import TimerView from "@/views/TimerView";

export default function DisplayView() {
  return (
    <div>
      <TimerView />
      <BlindsView />
      <NextView />
    </div>
  );
}
