import type { FactorKey, Preferences } from '../types';

export type FactorMeta = {
  key: FactorKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  description: string;
};

export const FACTORS: readonly FactorMeta[] = [
  {
    key: 'avgTempF',
    label: 'Avg Temperature',
    unit: '°F',
    min: 0,
    max: 100,
    step: 1,
    default: 68,
    description: 'Annual mean temperature',
  },
  {
    key: 'rainInches',
    label: 'Annual Rainfall',
    unit: 'in',
    min: 0,
    max: 120,
    step: 1,
    default: 30,
    description: 'Total yearly precipitation (excluding snow)',
  },
  {
    key: 'snowInches',
    label: 'Annual Snowfall',
    unit: 'in',
    min: 0,
    max: 120,
    step: 1,
    default: 0,
    description: 'Total yearly snow',
  },
  {
    key: 'sunHours',
    label: 'Sunshine',
    unit: 'hr/yr',
    min: 1000,
    max: 4200,
    step: 25,
    default: 2800,
    description: 'Annual hours of bright sunshine',
  },
  {
    key: 'humidityPct',
    label: 'Humidity',
    unit: '%',
    min: 20,
    max: 95,
    step: 1,
    default: 55,
    description: 'Average relative humidity',
  },
  {
    key: 'dailyVarianceF',
    label: 'Daily Temp Swing',
    unit: '°F',
    min: 5,
    max: 40,
    step: 1,
    default: 18,
    description: 'Average difference between daily high and low',
  },
] as const;

export const FACTOR_BY_KEY: Record<FactorKey, FactorMeta> = Object.fromEntries(
  FACTORS.map((f) => [f.key, f]),
) as Record<FactorKey, FactorMeta>;

export function defaultPreferences(): Preferences {
  const prefs: Partial<Preferences> = {};
  for (const f of FACTORS) {
    prefs[f.key] = { target: f.default, weight: 50 };
  }
  return prefs as Preferences;
}
