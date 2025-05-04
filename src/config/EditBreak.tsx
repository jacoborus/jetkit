import { GameLevels } from "@/schemas";
import RangeSlider, { RangeBars } from "@/components/RangeSlider";
import { getIndexLevels } from "@/lib/util";

interface EditBreakProps {
  change: (position: number, duration: number) => void;
  position: number;
  duration: number;
  levels: GameLevels;
  id: string;
}

export default function EditBreak({
  change,
  duration,
  levels,
  position,
  id,
}: EditBreakProps) {
  const indexes = getIndexLevels(levels);

  function updateDuration(value: number) {
    change(position, value);
  }

  function updatePosition(value: number) {
    change(value, duration);
  }

  return (
    <div className="py-5">
      <div className="flex flex-col">
        <div className="flex flex-col text-center">
          <span className="text-lg">Duration:</span>
          <span className="text-5xl font-bold">{duration}</span>
          <span className="text-lg mb-5">minutes</span>
          <RangeSlider
            id="break-duration"
            min={5}
            max={90}
            step={5}
            value={duration}
            onChange={updateDuration}
          />
          <RangeBars amount={18} />
        </div>

        <div className="divider my-6" />

        <div className="flex flex-col">
          {levels.map(
            (level, i) =>
              level.id !== id && (
                <div className="form-control" key={i}>
                  <label className="label cursor-pointer">
                    <span className="label-text">
                      {`${indexes[i]} :`}{" "}
                      {level.type === "game"
                        ? `${level.blinds[0]}/${level.blinds[1]}`
                        : "break"}
                    </span>
                    <input
                      onChange={() => updatePosition(i + 1)}
                      type="radio"
                      checked={position - 1 === i}
                      name="radio-10"
                      className="radio checked:bg-red-500"
                      disabled={level.id !== id && level.type === "break"}
                    />
                  </label>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
