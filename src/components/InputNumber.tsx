interface IInputNumber {
  id: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}

export default function InputNumber({
  id,
  value,
  onChange,
  min = 0,
}: IInputNumber) {
  function changeVal(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value);
    if (isNaN(val)) onChange(min);
    else onChange(val);
  }

  return (
    <input
      id={id}
      className="input input-bordered w-full max-w-xs text-right"
      value={value}
      min={min}
      onChange={changeVal}
      type="number"
    />
  );
}
