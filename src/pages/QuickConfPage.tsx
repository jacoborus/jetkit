import { useState } from "react";
import { useNavigate, Link } from "react-router";

import { defaultBlinds } from "@/lib/data";
import RangeSlider, { RangeSliderLabelled } from "@/components/RangeSlider";
import { sessionLoad, sessionSave } from "@/lib/storage-utils";
import Checkbox from "@/components/CheckBox";
import { GameLevels, QuickConf, getDefaultQuickConf } from "../schemas";
import { generateId } from "@/lib/util";
import { useGameStore } from "@/store/game-store";

export default function QuickConfPage() {
  const store = useGameStore();
  const navigate = useNavigate();
  const [conf, setConf] = useState(
    sessionLoad<QuickConf>("quick-conf") || getDefaultQuickConf(),
  );

  function updateConf(key: keyof QuickConf) {
    return (value: QuickConf[typeof key]) => {
      const newConf = { ...conf, [key]: value };
      setConf(newConf);
      sessionSave("quick-conf", newConf);
    };
  }

  function startGame() {
    store.setLevels(getQuickRounds(conf));
    navigate("/game");
  }

  return (
    <div className="flex-col">
      <Link className="btn btn-info" to="/setup/custom">
        Advanced Config
      </Link>
      <div className="card">
        <div className="card-body">
          <div className="text-right">
            <span className="text-lg text-right">Level duration</span>
            <br />
            <span className="font-bold text-4xl">{conf.duration} minutes</span>
          </div>

          <RangeSlider
            id="duration"
            min={5}
            max={60}
            step={5}
            value={conf.duration}
            onChange={updateConf("duration")}
          />
        </div>
      </div>

      <div className="divider"></div>

      <p className="text-lg text-right">Initial blinds</p>
      <p className="font-bold text-4xl text-right">
        ${defaultBlinds[conf.initBlinds][0]} / $
        {defaultBlinds[conf.initBlinds][1]}
      </p>
      <RangeSlider
        id="init-blinds"
        min={0}
        max={9}
        step={1}
        value={conf.initBlinds}
        onChange={updateConf("initBlinds")}
      />

      <div className="divider"></div>

      <div className="p-2">
        <Checkbox
          id="default-checkbox"
          value={conf.withBreaks}
          onChange={updateConf("withBreaks")}
          label="Use breaks?"
        />
      </div>

      {conf.withBreaks && (
        <div>
          <RangeSliderLabelled
            id="break-duration"
            min={5}
            max={90}
            step={5}
            value={conf.breakDuration}
            label={`Break duration: ${conf.breakDuration} minutes`}
            onChange={updateConf("breakDuration")}
          />

          <RangeSliderLabelled
            id="break-interval"
            min={0}
            max={10}
            step={1}
            value={conf.breakInterval}
            label={`Break interval: ${conf.breakInterval} rounds`}
            onChange={updateConf("breakInterval")}
          />
        </div>
      )}

      <div className="divider"></div>
      <p className="text-right p-2">
        <button onClick={startGame} className="btn btn-outline">
          Start
        </button>
      </p>
    </div>
  );
}

export function getQuickRounds(options: QuickConf) {
  const rounds: GameLevels = [];
  const blinds = defaultBlinds.slice(options.initBlinds);
  blinds.forEach((pair, i) => {
    rounds.push({
      id: generateId(),
      type: "game",
      blinds: pair.slice(0) as [number, number],
      duration: options.duration,
      ante: 0,
    });

    if (
      options.withBreaks &&
      i < blinds.length - 1 &&
      (i + 1) % options.breakInterval === 0
    ) {
      rounds.push({
        type: "break",
        duration: options.breakDuration,
        id: generateId(),
      });
    }
  });
  return rounds;
}
