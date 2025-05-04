import RangeSlider, { RangeBars } from "@/components/RangeSlider";
import { useState } from "react";
import PopUp from "@/components/PopUp";

interface IAddBreaksModal {
  addBreaks: (interval: number, duration: number) => void;
  cancel: () => void;
  isOpen: boolean;
}

export default function AddBreaksModal({
  addBreaks,
  cancel,
  isOpen,
}: IAddBreaksModal) {
  const [interval, setBreakInterval] = useState(5);
  const [duration, setDuration] = useState(20);

  const buttons: [{ name: string; onClick: () => void }] = [
    {
      name: "Add",
      onClick: () => {
        addBreaks(interval, duration);
      },
    },
  ];

  return (
    <PopUp buttons={buttons} cancelText="Cancel" close={cancel} isOpen={isOpen}>
      <h3 className="font-bold text-lg mb-4">Add breaks</h3>
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
          onChange={setDuration}
        />
        <RangeBars amount={18} />
      </div>
      <div className="divider my-4" />

      <div className="flex flex-col text-center">
        <span className="text-lg">Interval:</span>
        <span className="text-5xl font-bold">{interval}</span>
        <span className="text-lg mb-5">levels</span>
        <RangeSlider
          id="break-interval"
          min={1}
          max={10}
          step={1}
          value={interval}
          onChange={setBreakInterval}
        />
        <RangeBars amount={10} />
      </div>
    </PopUp>
  );
}
