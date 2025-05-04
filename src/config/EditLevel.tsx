import { Level } from "@/schemas";
import RangeSlider, { RangeBars } from "@/components/RangeSlider";
import InputNumber from "@/components/InputNumber";
import { useCustomStore } from "@/store/custom-store";

interface EditLevelProps {
  change: (level: Level) => void;
  level: Level;
}

export default function EditLevel({ change, level }: EditLevelProps) {
  const store = useCustomStore();
  const { conf } = store;

  function updateBlinds(small: number) {
    change({ ...level, blinds: [small, small * 2] });
  }

  function updateAnte(ante: number) {
    change({ ...level, ante });
  }

  function updateDuration(duration: number) {
    change({ ...level, duration });
  }

  return (
    <div className="py-5">
      <div className="flex flex-col">
        <div className="flex flex-col items-end">
          <label htmlFor="new-small-blind" className="text-lg">
            Small blind
          </label>
          <div className="flex text-5xl font-bold">
            <span className="mr-2">$</span>
            <InputNumber
              id="new-small-blind"
              value={level.blinds[0]}
              onChange={updateBlinds}
              min={1}
            />
          </div>
          <label className="text-lg">Big blind</label>
          <span className="text-5xl font-bold">$ {level.blinds[1]}</span>
        </div>
      </div>

      {conf.withAnte && (
        <>
          <div className="divider my-6" />

          <div hidden={!conf.withAnte} className="flex flex-col items-center">
            <label htmlFor="new-ante" className="text-lg mr-4">
              Ante
            </label>

            <div className="flex text-5xl font-bold">
              <span className="mr-3">$</span>
              <InputNumber
                id="new-ante"
                value={level.ante}
                onChange={updateAnte}
              />
            </div>
          </div>
        </>
      )}
      {!conf.lockLevelDuration && (
        <>
          <div className="divider my-6" />
          <div className="flex flex-col text-center">
            <span className="text-lg">Duration:</span>
            <span className="text-5xl font-bold">{level.duration}</span>
            <span className="text-lg mb-5">minutes</span>
            <RangeSlider
              id="break-duration"
              min={5}
              max={90}
              step={5}
              value={level.duration}
              onChange={updateDuration}
            />
            <RangeBars amount={Math.floor(90 / 5)} />
          </div>
        </>
      )}
    </div>
  );
}
