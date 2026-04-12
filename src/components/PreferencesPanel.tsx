import { useState } from 'react';
import type { Preferences, Preference, FactorKey } from '../types';
import { FACTORS } from '../lib/factors';
import { FactorSlider } from './FactorSlider';

type Props = {
  prefs: Preferences;
  onChange: (next: Preferences) => void;
  onResetAll: () => void;
};

export function PreferencesPanel({ prefs, onChange, onResetAll }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const updateFactor = (key: FactorKey, next: Preference) => {
    onChange({ ...prefs, [key]: next });
  };

  return (
    <aside className={`prefs-panel ${collapsed ? 'prefs-collapsed' : ''}`}>
      <div className="prefs-header">
        <h2>Your ideal climate</h2>
        <div className="prefs-header-actions">
          <button className="reset-all" onClick={onResetAll}>
            Reset all
          </button>
          <button
            className="collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand filters' : 'Collapse filters'}
          >
            {collapsed ? 'Show filters' : 'Hide filters'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <>
          <p className="prefs-intro">
            For each factor, drag the two handles to pick the range you'd be happy
            with. Cities scoring inside every range get 100% match. Drag a slider
            to its full span to ignore that factor.
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
        </>
      )}
    </aside>
  );
}
