import type { RankedCity } from '../types';
import { FACTORS } from '../lib/factors';

type Props = {
  rank: number;
  ranked: RankedCity;
};

export function CityCard({ rank, ranked }: Props) {
  const { city, matchPct, contributions } = ranked;
  const climate = city.climate;

  // Find the best and worst contributing factors to explain the match
  const contribEntries = Object.entries(contributions) as [
    keyof typeof contributions,
    number,
  ][];
  const nonZero = contribEntries.filter(([, v]) => v > 0);
  const worst = nonZero.sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="city-card">
      <div className="city-head">
        <div className="city-rank">#{rank}</div>
        <div className="city-name">
          <strong>{city.name}</strong>
          <span className="city-country">{city.country}</span>
        </div>
        <div className="match">
          <div className="match-pct">{Math.round(matchPct)}%</div>
          <div className="match-label">match</div>
        </div>
      </div>

      <div className="climate-grid">
        {FACTORS.map((f) => {
          const value = climate[f.key];
          const contrib = contributions[f.key];
          const isWorst = worst && worst[0] === f.key && worst[1] > 0.05;
          return (
            <div
              key={f.key}
              className={`climate-cell${isWorst ? ' climate-worst' : ''}`}
              title={
                contrib > 0
                  ? `Off by ${(contrib * 100).toFixed(0)} weighted pts`
                  : 'Not weighted'
              }
            >
              <div className="climate-key">{f.label}</div>
              <div className="climate-val">
                {value}
                <span className="climate-unit"> {f.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
