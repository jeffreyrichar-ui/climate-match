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
    humidityPct: number;
    dailyVarianceF: number;
  };
};

export type FactorKey =
  | 'avgTempF'
  | 'rainInches'
  | 'snowInches'
  | 'sunHours'
  | 'humidityPct'
  | 'dailyVarianceF';

export type Preference = { target: number; weight: number };
export type Preferences = Record<FactorKey, Preference>;

export type RankedCity = {
  city: City;
  score: number;
  matchPct: number;
  contributions: Record<FactorKey, number>;
};
