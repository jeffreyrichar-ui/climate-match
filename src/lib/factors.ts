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
  {
    key: 'summerHighF',
    label: 'Summer High',
    unit: '°F',
    min: 40,
    max: 120,
    step: 1,
    defaultMin: 75,
    defaultMax: 90,
    description: 'Average daily high in the hottest month',
    markers: [
      { value: 60, label: 'Reykjavik' },
      { value: 72, label: 'San Fran' },
      { value: 85, label: 'NYC' },
      { value: 95, label: 'Dallas' },
      { value: 108, label: 'Phoenix' },
    ],
  },
  {
    key: 'winterLowF',
    label: 'Winter Low',
    unit: '°F',
    min: -40,
    max: 80,
    step: 1,
    defaultMin: 30,
    defaultMax: 60,
    description: 'Average daily low in the coldest month',
    markers: [
      { value: -10, label: 'Yakutsk' },
      { value: 15, label: 'Chicago' },
      { value: 35, label: 'NYC' },
      { value: 55, label: 'Miami' },
      { value: 70, label: 'Honolulu' },
    ],
  },
  {
    key: 'rainyDays',
    label: 'Rainy Days',
    unit: 'days/yr',
    min: 0,
    max: 250,
    step: 1,
    defaultMin: 40,
    defaultMax: 140,
    description: 'Days per year with measurable rain',
    markers: [
      { value: 10, label: 'Sahara' },
      { value: 60, label: 'LA' },
      { value: 120, label: 'NYC' },
      { value: 170, label: 'Seattle' },
      { value: 220, label: 'Tropics' },
    ],
  },
  {
    key: 'windMph',
    label: 'Wind Speed',
    unit: 'mph',
    min: 0,
    max: 30,
    step: 1,
    defaultMin: 5,
    defaultMax: 18,
    description: 'Average daily peak wind speed',
    markers: [
      { value: 5, label: 'Calm' },
      { value: 10, label: 'Light' },
      { value: 16, label: 'Breezy' },
      { value: 22, label: 'Windy' },
    ],
  },
  {
    key: 'dewPointF',
    label: 'Dew Point',
    unit: '°F',
    min: 0,
    max: 80,
    step: 1,
    defaultMin: 35,
    defaultMax: 60,
    description: 'How "sticky" the air feels — better than humidity for muggy weather',
    markers: [
      { value: 20, label: 'Bone dry' },
      { value: 40, label: 'Pleasant' },
      { value: 55, label: 'Sticky' },
      { value: 65, label: 'Oppressive' },
      { value: 75, label: 'Tropical' },
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
