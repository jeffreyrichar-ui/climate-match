import type { Preferences, Preference, FactorKey } from '../types';
import { FACTORS } from '../lib/factors';
import { FactorSlider } from './FactorSlider';

type Props = {
  prefs: Preferences;
  onChange: (next: Preferences) => void;
  onResetAll: () => void;
};

export function PreferencesPanel({ prefs, onChange, onResetAll }: Props) {
  const updateFactor = (key: FactorKey, next: Preference) => {
    onChange({ ...prefs, [key]: next });
  };

  return (
    <aside className="prefs-panel">
      <div className="prefs-header">
        <h2>Your ideal climate</h2>
        <button className="reset-all" onClick={onResetAll}>
          Reset all
        </button>
      </div>
      <p className="prefs-intro">
        Drag the <em>ideal</em> slider to pick your target for each factor. Use
        the <em>how much it matters</em> slider to tell us what you care about.
      </p>
      <div className="factors">
        {FACTORS.map((f) => (
          <FactorSlider
            key={f.key}
            factor={f}
            value={prefs[f.key]}
            onChange={(next) => updateFactor(f.key, next)}
          />
        ))}
      </div>
    </aside>
  );
}
