import type { FactorKey, Preferences } from '../types';

export type Marker = { value: number; label: string };

export type FactorMeta = {
  key: FactorKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultMin: number;
  defaultMax: number;
  description: string;
  markers: readonly Marker[];
};

export const FACTORS: readonly FactorMeta[] = [
  {
    key: 'avgTempF',
    label: 'Avg Temperature',
    unit: '°F',
    min: 0,
    max: 100,
    step: 1,
    defaultMin: 60,
    defaultMax: 75,
    description: 'Annual mean temperature',
    markers: [
      { value: 30, label: 'Anchorage' },
      { value: 50, label: 'Seattle' },
      { value: 65, label: 'Paris' },
      { value: 78, label: 'Miami' },
      { value: 90, label: 'Dubai' },
    ],
  },
  {
    key: 'rainInches',
    label: 'Annual Rainfall',
    unit: 'in',
    min: 0,
    max: 120,
    step: 1,
    defaultMin: 10,
    defaultMax: 45,
    description: 'Total yearly precipitation (excluding snow)',
    markers: [
      { value: 4, label: 'Phoenix' },
      { value: 25, label: 'Denver' },
      { value: 45, label: 'NYC' },
      { value: 75, label: 'Miami' },
      { value: 100, label: 'Tropics' },
    ],
  },
  {
    key: 'snowInches',
    label: 'Annual Snowfall',
    unit: 'in',
    min: 0,
    max: 120,
    step: 1,
    defaultMin: 0,
    defaultMax: 10,
    description: 'Total yearly snow',
    markers: [
      { value: 0, label: 'None' },
      { value: 25, label: 'NYC' },
      { value: 55, label: 'Denver' },
      { value: 90, label: 'Quebec' },
    ],
  },
  {
    key: 'sunHours',
    label: 'Sunshine',
    unit: 'hr/yr',
    min: 1000,
    max: 4200,
    step: 25,
    defaultMin: 2400,
    defaultMax: 3600,
    description: 'Annual hours of bright sunshine',
    markers: [
      { value: 1300, label: 'Reykjavik' },
      { value: 1700, label: 'London' },
      { value: 2500, label: 'NYC' },
      { value: 3200, label: 'LA' },
      { value: 3900, label: 'Phoenix' },
    ],
  },
  {
    key: 'humidityPct',
    label: 'Humidity',
    unit: '%',
    min: 20,
    max: 95,
    step: 1,
    defaultMin: 45,
    defaultMax: 70,
    description: 'Average relative humidity',
    markers: [
      { value: 30, label: 'Desert' },
      { value: 50, label: 'Comfy' },
      { value: 70, label: 'Humid' },
      { value: 85, label: 'Tropical' },
    ],
  },
  {
    key: 'dailyVarianceF',
    label: 'Daily Temp Swing',
    unit: '°F',
    min: 5,
    max: 40,
    step: 1,
    defaultMin: 12,
    defaultMax: 25,
    description: 'Average difference between daily high and low',
    markers: [
      { value: 10, label: 'Hawaii' },
      { value: 18, label: 'NYC' },
      { value: 28, label: 'Desert' },
      { value: 38, label: 'Extreme' },
    ],
  },
] as const;

export const FACTOR_BY_KEY: Record<FactorKey, FactorMeta> = Object.fromEntries(
  FACTORS.map((f) => [f.key, f]),
) as Record<FactorKey, FactorMeta>;

export function defaultPreferences(): Preferences {
  const prefs: Partial<Preferences> = {};
  for (const f of FACTORS) {
    prefs[f.key] = { min: f.defaultMin, max: f.defaultMax };
  }
  return prefs as Preferences;
}

/** Returns true if the range covers the entire allowed span (i.e. "any"). */
export function isFullRange(pref: { min: number; max: number }, factor: FactorMeta) {
  return pref.min <= factor.min && pref.max >= factor.max;
}
