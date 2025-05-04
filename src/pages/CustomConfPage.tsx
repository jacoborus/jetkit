import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Club,
  Delete,
  DollarSign,
  HandCoins,
  Hash,
  Play,
  RotateCcw,
  Settings,
  Settings2,
  Sparkles,
  Timer,
  Trash2,
  Wine,
  XIcon,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { formatMoney } from "@/lib/storage-utils";
import { getQuickRounds } from "./QuickConfPage";
import { EditLevelModal } from "@/config/EditLevelModal";
import AddBreaksModal from "@/config/AutoBreaksModal";
import { EditBreakModal } from "@/config/EditBreakModal";
import { RangeSliderLabelled } from "@/components/RangeSlider";
import Checkbox from "@/components/CheckBox";
import { getIndexLevels } from "@/lib/util";
import { useCustomStore } from "@/store/custom-store";
import { useGameStore } from "@/store/game-store";
import {
  Break,
  CustomConf,
  getBreak,
  getDefaultQuickConf,
  getLevel,
  Level,
} from "../schemas";

export default function CustomPage() {
  const store = useCustomStore();
  const navigate = useNavigate();
  const gameStore = useGameStore();
  const { conf, levels, saveLevels } = store;
  const authStore = useAuthStore();

  useEffect(() => {
    if (authStore.isLoggedIn) store.getConfigId()
  }, [authStore.isLoggedIn]); // eslint-disable-line

  function setSelectedLevel(level?: Level) {
    store.setSelectedLevel(level);
  }

  function setSelectedBreak(breakk?: Break) {
    store.setSelectedBreak(breakk);
  }

  const [isAddBreaksOpen, setIsAddBreaksOpen] = useState(false);

  const indexes = useMemo(() => getIndexLevels(store.levels), [store.levels]);

  const handlers = {
    updateConf: (key: keyof CustomConf) => (value: CustomConf[typeof key]) => {
      store.updateConf(key, value);
    },

    addModal: () => store.setNewLevel(getLevel()),
    addBreakModal: () => store.setNewBreak(getBreak()),
    deleteRound: (i: number) => () =>
      saveLevels(store.levels.filter((_, j) => j !== i)),
    clearRounds: () => saveLevels([]),
    resetRounds: () => saveLevels(getQuickRounds(getDefaultQuickConf())),
    startGame: () => {
      if (store.levels.length) {
        gameStore.setLevels(store.levels);
        navigate("/game");
      }
    },
  };

  return (
    <div id="custom-setup" className="max-w-xl">
      <Link className="btn btn-info mr-4" to="/setup">Simple Config</Link>
      {authStore.isLoggedIn && (
        <button className="btn btn-info mr-4" onClick={store.saveConfig}>
          <Club size={18} />
          Save config
        </button>
      )}
      {store.configID && authStore.isLoggedIn && (
        <button className="btn btn-info mr-4" onClick={store.loadConfig}>
          <Club size={18} />
          Load config
        </button>
      )}
      <div className="divider"></div>

      <button className="btn btn-info mr-4" onClick={handlers.addModal}>
        <Club size={18} /> Add level
      </button>
      <button
        className="btn btn-info mr-4"
        onClick={handlers.addBreakModal}
      >
        <Wine size={18} /> Add break
      </button>
      <Checkbox
        id="lock-level-duration"
        value={store.conf.lockLevelDuration}
        onChange={handlers.updateConf("lockLevelDuration")}
        label="Lock level duration"
      />
      {store.conf.lockLevelDuration && (
        <RangeSliderLabelled
          id="duration"
          min={5}
          max={60}
          step={5}
          value={conf.baseLevelDuration}
          label={`Level duration: ${conf.baseLevelDuration} minutes`}
          onChange={handlers.updateConf("baseLevelDuration")}
        />
      )}
      <Checkbox
        id="with-ante"
        value={conf.withAnte}
        onChange={handlers.updateConf("withAnte")}
        label="Use ante"
      />
      <table className="table table-sm my-8 text-center">
        <thead>
          <tr>
            <th className="text-stone-500 text-xs px-0">
              <Hash size={14} className="inline" />
            </th>
            <th>
              <DollarSign size={18} className="inline" />
            </th>
            <th>
              <DollarSign size={18} className="inline" />
            </th>
            <th hidden={!conf.withAnte}>
              <HandCoins size={18} className="inline" />
            </th>
            <th hidden={conf.lockLevelDuration}>
              <Timer size={18} className="inline" />
            </th>
            <th className="w-[1%]">
              <Settings size={18} className="inline" />
            </th>
            <th className="w-[1%]">
              <Delete size={18} className="inline" />
            </th>
          </tr>
        </thead>
        <tbody>
          {levels.map((round, i) => (
            <tr key={round.id} className="text-2xl">
              <td className="text-stone-500 text-xs px-0">{indexes[i]}</td>
              {round.type === "game" ? (
                <>
                  <td className="text-center">
                    <span>{formatMoney(round.blinds[0])}</span>
                  </td>
                  <td className="text-center">
                    <span>{formatMoney(round.blinds[1])}</span>
                  </td>
                  <td className="text-center" hidden={!conf.withAnte}>
                    <span>{round.ante}</span>
                  </td>
                  <td className="text-center" hidden={conf.lockLevelDuration}>
                    <span>{round.duration}</span>
                  </td>
                  <td className="w-[1%]">
                    <button
                      className="btn btn-sm btn-circle"
                      onClick={() => setSelectedLevel(round as Level)}
                    >
                      <Settings2 size={16} />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td
                    colSpan={conf.withAnte ? 3 : 2}
                    className="pl-5 font-semibold tracking-widest text-center"
                  >
                    -- {conf.lockLevelDuration ? `${round.duration} m.` : ""}{" "}
                    BREAK --
                  </td>
                  <td className="text-center" hidden={conf.lockLevelDuration}>
                    <span>{round.duration}</span>
                  </td>
                  <td className="w-[1%]">
                    <button
                      className="btn btn-sm btn-circle"
                      onClick={() => setSelectedBreak(round as Break)}
                    >
                      <Settings2 size={16} />
                    </button>
                  </td>
                </>
              )}
              <td className="w-[1%]">
                <button
                  className="btn btn-sm btn-circle"
                  onClick={handlers.deleteRound(i)}
                >
                  <XIcon size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary mr-4" onClick={handlers.startGame}>
        <Play size={18} /> Start game
      </button>
      <button className="btn btn-sm mr-4 btn-error" onClick={handlers.clearRounds}>
        <Trash2 size={18} /> Remove all
      </button>
      <button className="btn btn-sm btn-error" onClick={handlers.resetRounds}>
        <RotateCcw size={18} /> Reset levels
      </button>
      <button
        className="btn btn-info"
        onClick={() => setIsAddBreaksOpen(true)}
      >
        <Sparkles size={18} /> Add automatic breaks
      </button>
      <EditLevelModal
        title="Edit level"
        buttonText="Save"
        target={store.selectedLevel}
        save={store.editLevel}
        close={() => setSelectedLevel(undefined)}
      />
      <EditLevelModal
        title="Add level"
        save={store.addLevel}
        buttonText="Add"
        target={store.newLevel}
        close={() => store.setNewLevel(undefined)}
      />
      <EditBreakModal
        title="Edit break"
        buttonText="Save"
        breakk={store.selectedBreak}
        save={store.editBreak}
        cancel={() => setSelectedBreak(undefined)}
        levels={levels}
      />
      <EditBreakModal
        title="Add break"
        buttonText="Add"
        breakk={store.newBreak}
        save={store.addBreak}
        cancel={() => store.setNewBreak(undefined)}
        levels={levels}
      />
      <AddBreaksModal
        isOpen={isAddBreaksOpen}
        addBreaks={store.addBreaks}
        cancel={() => setIsAddBreaksOpen(false)}
      />
    </div>
  );
}
