export interface IRange {
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}

export interface IRangeLabelled extends IRange {
  label: string;
}

export default function RangeSlider({
  id,
  value,
  onChange,
  step,
  min,
  max,
}: IRange) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      className="range range-xs"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

export function RangeSliderLabelled({
  id,
  label,
  value,
  onChange,
  step,
  min,
  max,
}: IRangeLabelled) {
  return (
    <div className="p-2">
      <label htmlFor={id} className="block mb-4">
        {label}
      </label>
      <RangeSlider
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(n) => onChange(n)}
      />
    </div>
  );
}

export function RangeBars({ amount }: { amount: number }) {
  return (
    <div className="flex w-full justify-between px-2 text-xs">
      {Array.from({ length: amount }, (_, i) => (
        <span key={i}>|</span>
      ))}
    </div>
  );
}
