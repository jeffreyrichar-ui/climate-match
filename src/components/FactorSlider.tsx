import type { Preference } from '../types';
import type { FactorMeta } from '../lib/factors';
import { isFullRange } from '../lib/factors';

type Props = {
  factor: FactorMeta;
  value: Preference;
  onChange: (next: Preference) => void;
};

export function FactorSlider({ factor, value, onChange }: Props) {
  const reset = () =>
    onChange({ min: factor.defaultMin, max: factor.defaultMax });

  const setMin = (n: number) => {
    const clamped = Math.min(n, value.max);
    onChange({ ...value, min: clamped });
  };
  const setMax = (n: number) => {
    const clamped = Math.max(n, value.min);
    onChange({ ...value, max: clamped });
  };

  const ignored = isFullRange(value, factor);

  // visual bar fill — proportional position of the selected range on the track
  const span = factor.max - factor.min;
  const leftPct = ((value.min - factor.min) / span) * 100;
  const rightPct = ((value.max - factor.min) / span) * 100;

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

      <div className="range-summary">
        {ignored ? (
          <span className="muted">Any value (this factor is ignored)</span>
        ) : (
          <>
            <strong>{value.min}</strong> – <strong>{value.max}</strong>{' '}
            {factor.unit}
          </>
        )}
      </div>

      <div className="range-track-wrap">
        <div className="range-track">
          <div
            className="range-fill"
            style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
          />
        </div>
        <input
          type="range"
          className="range-input range-input-min"
          min={factor.min}
          max={factor.max}
          step={factor.step}
          value={value.min}
          onChange={(e) => setMin(Number(e.target.value))}
        />
        <input
          type="range"
          className="range-input range-input-max"
          min={factor.min}
          max={factor.max}
          step={factor.step}
          value={value.max}
          onChange={(e) => setMax(Number(e.target.value))}
        />
      </div>

      <div className="range-bounds">
        <span>
          {factor.min} {factor.unit}
        </span>
        <span>
          {factor.max} {factor.unit}
        </span>
      </div>
    </div>
  );
}
