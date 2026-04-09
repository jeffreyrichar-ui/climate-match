import type { City, FactorKey, Preferences, RankedCity } from '../types';
import { FACTORS, FACTOR_BY_KEY } from './factors';

/**
 * Score a single city against the preferences.
 * Lower score = better match. Also returns per-factor contributions.
 */
export function scoreCity(city: City, prefs: Preferences) {
  const contributions = {} as Record<FactorKey, number>;
  let score = 0;
  let maxPossible = 0;

  for (const f of FACTORS) {
    const pref = prefs[f.key];
    const weight = pref.weight / 100;
    if (weight === 0) {
      contributions[f.key] = 0;
      continue;
    }
    const range = f.max - f.min;
    const value = city.climate[f.key];
    const rawDist = Math.abs(value - pref.target) / range;
    const dist = Math.min(1, rawDist); // clamp outliers
    const contribution = dist * weight;
    contributions[f.key] = contribution;
    score += contribution;
    maxPossible += weight;
  }

  const matchPct =
    maxPossible === 0 ? 0 : Math.max(0, 100 * (1 - score / maxPossible));
  return { score, matchPct, contributions };
}

/**
 * Rank cities by how well they match the preferences.
 * If every weight is 0, returns cities alphabetically with matchPct=0.
 */
export function rankCities(
  cities: readonly City[],
  prefs: Preferences,
  limit = 20,
): RankedCity[] {
  const allZero = FACTORS.every((f) => prefs[f.key].weight === 0);

  if (allZero) {
    return [...cities]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, limit)
      .map((city) => ({
        city,
        score: 0,
        matchPct: 0,
        contributions: Object.fromEntries(
          FACTORS.map((f) => [f.key, 0]),
        ) as Record<FactorKey, number>,
      }));
  }

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

export { FACTOR_BY_KEY };
