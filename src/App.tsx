import { useEffect, useMemo, useState } from 'react';
import { PreferencesPanel } from './components/PreferencesPanel';
import { ResultsList } from './components/ResultsList';
import { defaultPreferences } from './lib/factors';
import { rankCities, validateCity } from './lib/scoring';
import type { City, Preferences } from './types';
import citiesData from './data/cities.json';

export default function App() {
  const [prefs, setPrefs] = useState<Preferences>(() => defaultPreferences());

  // Validate dataset once on mount and drop any bad rows.
  const cities = useMemo<City[]>(() => {
    const good: City[] = [];
    for (const raw of citiesData as unknown[]) {
      const err = validateCity(raw);
      if (err) {
        console.warn('Skipping invalid city:', err, raw);
      } else {
        good.push(raw as City);
      }
    }
    return good;
  }, []);

  const results = useMemo(() => rankCities(cities, prefs, 20), [cities, prefs]);

  useEffect(() => {
    document.title = `Climate Match · ${cities.length} cities`;
  }, [cities.length]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="logo">🌤</span> Climate Match
        </h1>
        <p className="tagline">
          Find cities with the weather <em>you</em> want to live in.
        </p>
      </header>

      <main className="app-main">
        <PreferencesPanel
          prefs={prefs}
          onChange={setPrefs}
          onResetAll={() => setPrefs(defaultPreferences())}
        />
        <ResultsList results={results} totalCities={cities.length} />
      </main>

      <footer className="app-footer">
        Climate data is annual averages compiled from public climate normals.
        Use as a guide, not gospel.
      </footer>
    </div>
  );
}
