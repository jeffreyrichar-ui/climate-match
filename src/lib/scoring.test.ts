import { describe, it, expect } from 'vitest';
import { rankCities, scoreCity } from './scoring';
import { defaultPreferences, FACTORS } from './factors';
import type { City, Preferences } from '../types';

const cities: City[] = [
  { name: 'Hot Dry',  country: 'X', lat: 0, lon: 0, climate: { avgTempF: 85, rainInches: 5,  snowInches: 0,  sunHours: 3800, dailyVarianceF: 25, summerHighF: 105, winterLowF: 50, rainyDays: 20,  windMph: 12, dewPointF: 35 } },
  { name: 'Cool Wet', country: 'X', lat: 0, lon: 0, climate: { avgTempF: 50, rainInches: 60, snowInches: 5,  sunHours: 1500, dailyVarianceF: 12, summerHighF: 70,  winterLowF: 35, rainyDays: 180, windMph: 14, dewPointF: 48 } },
  { name: 'Mild',     country: 'X', lat: 0, lon: 0, climate: { avgTempF: 65, rainInches: 20, snowInches: 0,  sunHours: 2800, dailyVarianceF: 15, summerHighF: 80,  winterLowF: 45, rainyDays: 90,  windMph: 10, dewPointF: 50 } },
  { name: 'Snowy',    country: 'X', lat: 0, lon: 0, climate: { avgTempF: 35, rainInches: 30, snowInches: 90, sunHours: 2000, dailyVarianceF: 15, summerHighF: 65,  winterLowF: 5,  rainyDays: 130, windMph: 11, dewPointF: 25 } },
];

/** Build a "wide-open" preference that ignores every factor. */
function wideOpen(): Preferences {
  const p = defaultPreferences();
  for (const f of FACTORS) {
    p[f.key] = { min: f.min, max: f.max };
  }
  return p;
}

describe('scoreCity', () => {
  it('gives 100% match when all factors are inside their ranges', () => {
    const prefs = wideOpen();
    prefs.avgTempF = { min: 60, max: 70 }; // Mild = 65
    const res = scoreCity(cities[2], prefs);
    expect(res.matchPct).toBe(100);
    expect(res.score).toBe(0);
  });

  it('penalizes a value below the range', () => {
    const prefs = wideOpen();
    prefs.avgTempF = { min: 80, max: 90 }; // Mild=65 is 15 below; span=100 → 0.15
    const res = scoreCity(cities[2], prefs);
    expect(res.contributions.avgTempF).toBeCloseTo(0.15);
  });

  it('penalizes a value above the range', () => {
    const prefs = wideOpen();
    prefs.avgTempF = { min: 40, max: 60 }; // Hot Dry=85 is 25 above; span=100 → 0.25
    const res = scoreCity(cities[0], prefs);
    expect(res.contributions.avgTempF).toBeCloseTo(0.25);
  });

  it('full-span range ignores a factor', () => {
    const prefs = wideOpen();
    const res = scoreCity(cities[0], prefs);
    for (const f of FACTORS) {
      expect(res.contributions[f.key]).toBe(0);
    }
    expect(res.matchPct).toBe(100);
  });
});

describe('rankCities', () => {
  it('ranks hot/dry city first when ranges target hot and dry', () => {
    const prefs = wideOpen();
    prefs.avgTempF = { min: 80, max: 100 };
    prefs.rainInches = { min: 0, max: 10 };
    const ranked = rankCities(cities, prefs);
    expect(ranked[0].city.name).toBe('Hot Dry');
  });

  it('ranks snowy city first when range targets lots of snow', () => {
    const prefs = wideOpen();
    prefs.snowInches = { min: 60, max: 120 };
    const ranked = rankCities(cities, prefs);
    expect(ranked[0].city.name).toBe('Snowy');
  });

  it('respects the limit parameter', () => {
    const prefs = wideOpen();
    prefs.avgTempF = { min: 60, max: 70 };
    const ranked = rankCities(cities, prefs, 2);
    expect(ranked).toHaveLength(2);
  });
});
