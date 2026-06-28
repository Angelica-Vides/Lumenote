import { COLOR_PRESETS, DEFAULT_NOTE_COLOR } from "../lib/validation";

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {COLOR_PRESETS.map((hex) => (
        <button
          key={hex}
          type="button"
          className={`color-swatch${value === hex ? " color-swatch--selected" : ""}`}
          style={{ background: hex }}
          onClick={() => onChange(hex)}
          aria-label={`Color ${hex}`}
          aria-pressed={value === hex}
        />
      ))}
      <label className="color-custom">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Custom color"
        />
        <span>Custom</span>
      </label>
    </div>
  );
}

export { DEFAULT_NOTE_COLOR };
