import type { Preference } from '../types';
import type { FactorMeta } from '../lib/factors';

type Props = {
  factor: FactorMeta;
  value: Preference;
  onChange: (next: Preference) => void;
};

export function FactorSlider({ factor, value, onChange }: Props) {
  const reset = () => onChange({ target: factor.default, weight: 50 });

  return (
    <div className="factor">
      <div className="factor-head">
        <div>
          <div className="factor-label">{factor.label}</div>
          <div className="factor-desc">{factor.description}</div>
        </div>
        <button className="reset-btn" onClick={reset} title="Reset this factor">
          ↺
        </button>
      </div>

      <div className="slider-row">
        <label className="slider-caption">
          Ideal: <strong>{value.target}</strong> {factor.unit}
        </label>
        <input
          type="range"
          min={factor.min}
          max={factor.max}
          step={factor.step}
          value={value.target}
          onChange={(e) =>
            onChange({ ...value, target: Number(e.target.value) })
          }
        />
      </div>

      <div className="slider-row">
        <label className="slider-caption weight-caption">
          How much it matters: <strong>{value.weight}</strong>
          {value.weight === 0 && <span className="muted"> (ignored)</span>}
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value.weight}
          onChange={(e) =>
            onChange({ ...value, weight: Number(e.target.value) })
          }
          className="weight-slider"
        />
      </div>
    </div>
  );
}
