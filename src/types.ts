export type City = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  climate: {
    avgTempF: number;
    rainInches: number;
    snowInches: number;
    sunHours: number;
    dailyVarianceF: number;
    summerHighF: number;
    winterLowF: number;
    rainyDays: number;
    windMph: number;
    dewPointF: number;
  };
};

export type FactorKey =
  | 'avgTempF'
  | 'rainInches'
  | 'snowInches'
  | 'sunHours'
  | 'dailyVarianceF'
  | 'summerHighF'
  | 'winterLowF'
  | 'rainyDays'
  | 'windMph'
  | 'dewPointF';

export type Preference = { min: number; max: number };
export type Preferences = Record<FactorKey, Preference>;

export type RankedCity = {
  city: City;
  score: number;
  matchPct: number;
  contributions: Record<FactorKey, number>;
};
