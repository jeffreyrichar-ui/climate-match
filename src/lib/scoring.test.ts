import { describe, it, expect } from 'vitest';
import { rankCities, scoreCity } from './scoring';
import { defaultPreferences } from './factors';
import type { City, Preferences } from '../types';

const cities: City[] = [
  { name: 'Hot Dry', country: 'X', lat: 0, lon: 0, climate: { avgTempF: 85, rainInches: 5,  snowInches: 0,  sunHours: 3800, humidityPct: 30, dailyVarianceF: 25 } },
  { name: 'Cool Wet', country: 'X', lat: 0, lon: 0, climate: { avgTempF: 50, rainInches: 60, snowInches: 5,  sunHours: 1500, humidityPct: 80, dailyVarianceF: 12 } },
  { name: 'Mild',    country: 'X', lat: 0, lon: 0, climate: { avgTempF: 65, rainInches: 20, snowInches: 0,  sunHours: 2800, humidityPct: 60, dailyVarianceF: 15 } },
  { name: 'Snowy',   country: 'X', lat: 0, lon: 0, climate: { avgTempF: 35, rainInches: 30, snowInches: 90, sunHours: 2000, humidityPct: 70, dailyVarianceF: 15 } },
];

function zeroWeights(): Preferences {
  const p = defaultPreferences();
  for (const k of Object.keys(p) as (keyof Preferences)[]) p[k].weight = 0;
  return p;
}

describe('scoreCity', () => {
  it('gives 100% match for perfect target (single factor)', () => {
    const prefs = zeroWeights();
    prefs.avgTempF = { target: 65, weight: 100 };
    const res = scoreCity(cities[2], prefs); // Mild is 65F
    expect(res.matchPct).toBe(100);
    expect(res.score).toBe(0);
  });

  it('zero weight factor contributes nothing', () => {
    const prefs = zeroWeights();
    prefs.avgTempF = { target: 0, weight: 0 };
    const res = scoreCity(cities[0], prefs);
    expect(res.contributions.avgTempF).toBe(0);
  });
});

describe('rankCities', () => {
  it('ranks hot/dry city first when user wants hot and dry', () => {
    const prefs = zeroWeights();
    prefs.avgTempF = { target: 85, weight: 100 };
    prefs.rainInches = { target: 0, weight: 100 };
    prefs.humidityPct = { target: 30, weight: 100 };
    const ranked = rankCities(cities, prefs);
    expect(ranked[0].city.name).toBe('Hot Dry');
  });

  it('ranks snowy city first when user wants snow', () => {
    const prefs = zeroWeights();
    prefs.snowInches = { target: 100, weight: 100 };
    const ranked = rankCities(cities, prefs);
    expect(ranked[0].city.name).toBe('Snowy');
  });

  it('returns alphabetical when all weights are zero', () => {
    const prefs = zeroWeights();
    const ranked = rankCities(cities, prefs);
    expect(ranked.map((r) => r.city.name)).toEqual([
      'Cool Wet',
      'Hot Dry',
      'Mild',
      'Snowy',
    ]);
    expect(ranked.every((r) => r.matchPct === 0)).toBe(true);
  });

  it('respects the limit parameter', () => {
    const prefs = zeroWeights();
    prefs.avgTempF = { target: 65, weight: 100 };
    const ranked = rankCities(cities, prefs, 2);
    expect(ranked).toHaveLength(2);
  });
});
