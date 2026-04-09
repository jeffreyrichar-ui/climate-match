import type { City, FactorKey, Preferences, RankedCity } from '../types';
import { FACTORS, FACTOR_BY_KEY, isFullRange } from './factors';

/**
 * Score a single city against the preferences.
 *
 * For each factor:
 *   - if the city's value is inside [min, max], distance is 0 (perfect)
 *   - otherwise, distance is how far outside the range, normalized to [0, 1]
 *     by the factor's full span.
 *
 * Score = sum of normalized distances. Lower = better.
 * matchPct = 100 * (1 - score / numFactors)  (each factor contributes max 1)
 */
export function scoreCity(city: City, prefs: Preferences) {
  const contributions = {} as Record<FactorKey, number>;
  let score = 0;

  for (const f of FACTORS) {
    const pref = prefs[f.key];
    const value = city.climate[f.key];
    const span = f.max - f.min;

    let dist: number;
    if (value >= pref.min && value <= pref.max) {
      dist = 0;
    } else if (value < pref.min) {
      dist = (pref.min - value) / span;
    } else {
      dist = (value - pref.max) / span;
    }
    dist = Math.min(1, dist);
    contributions[f.key] = dist;
    score += dist;
  }

  const matchPct = Math.max(0, 100 * (1 - score / FACTORS.length));
  return { score, matchPct, contributions };
}

/**
 * Rank cities by how well they match the preferences.
 */
export function rankCities(
  cities: readonly City[],
  prefs: Preferences,
  limit = 20,
): RankedCity[] {
  const ranked = cities.map<RankedCity>((city) => {
    const { score, matchPct, contributions } = scoreCity(city, prefs);
    return { city, score, matchPct, contributions };
  });

  ranked.sort((a, b) => a.score - b.score);
  return ranked.slice(0, limit);
}

/** Validate a raw city record at runtime. Returns error string or null. */
export function validateCity(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return 'not an object';
  const c = raw as Record<string, unknown>;
  if (typeof c.name !== 'string') return 'missing name';
  if (typeof c.country !== 'string') return 'missing country';
  if (typeof c.lat !== 'number') return 'missing lat';
  if (typeof c.lon !== 'number') return 'missing lon';
  const climate = c.climate as Record<string, unknown> | undefined;
  if (!climate) return 'missing climate';
  for (const f of FACTORS) {
    if (typeof climate[f.key] !== 'number') {
      return `missing climate.${f.key}`;
    }
  }
  return null;
}

export { FACTOR_BY_KEY, isFullRange };
