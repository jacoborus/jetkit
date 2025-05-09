import {
  useEffect,
  useRef
} from "react";
import { useNavigate } from "react-router";

import DisplayView from "@/views/DisplayView";
import { useGameStore } from "@/store/game-store";
import { useUiStore } from "@/store/ui-store";

export default function GamePage() {
  const store = useGameStore();
  const uiStore = useUiStore();
  const navigate = useNavigate();
  const { timerData: data,
    doTick
  } = store;

  const clockAppRef = useRef<HTMLDivElement>(null);

  async function resetTimer() {
    const confirmed = await uiStore.confirm({
      "title": 'This will end the game',
      "noCaption": "Cancel",
      "yesCaption": "Yes, end game"
    })
    if (!confirmed) return;
    store.resetTimer();
    // nosleep.disable();
    // if (isFullscreen.value) {
    //   document.exitFullscreen();
    // }
    navigate("/setup");
  }

  useEffect(() => {
    if (!data.running) return;
    const interval = setInterval(() => {
      if (!data.running) return;
      doTick(() => navigate("/setup"));
    }, 200);
    return () => clearInterval(interval);
  }, [data.running, doTick, navigate]);

  return (
    <div className="p-8" ref={clockAppRef}>

      {!store.sharing && !store.connecting && (
        <button onClick={store.startSharing} className="btn btn-primary">
          Start Sharing
        </button>
      )}

      <ul>
        <li>is sharing: {store.sharing ? 'yes' : 'no'}</li>
        <li>code: {store.code || ''}</li>
      </ul>

      {data.startedAt ? (
        <div>
          <DisplayView />
          <button onClick={store.togglePlay} className="btn">
            {data.running ? "Pause" : "Play"}
          </button>
          <button onClick={resetTimer} className="btn">
            Finish game
          </button>
        </div>
      ) : (
        <PreGame />
      )}
    </div>
  );
}

function PreGame() {
  const store = useGameStore();
  return (
    <div>
      <button onClick={store.startTimer} className="btn btn-primary">
        Ready?
      </button>
      <div className="divider my-2"></div>

      <div className="card w-full max-w-sm shadow-2xl bg-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center mb-3">
            Levels
          </h2>
          <ul>
            {store.timerData.levels.map((level, i) => (
              <li key={level.id}>#{i}: {level.duration} mins : {level.type}{level.id} </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
