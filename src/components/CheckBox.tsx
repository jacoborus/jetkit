export interface ICheck {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Checkbox({ id, label, value, onChange }: ICheck) {
  return (
    <div className="form-control">
      <label htmlFor={id} className="label cursor-pointer">
        <span className="label-text text-lg">{label}</span>
        <input
          id={id}
          type="checkbox"
          className="toggle"
          checked={value}
          onChange={() => onChange(!value)}
        />
      </label>
    </div>
  );
}
