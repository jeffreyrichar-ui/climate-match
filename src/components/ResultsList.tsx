import type { RankedCity } from '../types';
import { CityCard } from './CityCard';

type Props = {
  results: RankedCity[];
  totalCities: number;
};

export function ResultsList({ results, totalCities }: Props) {
  return (
    <section className="results-panel">
      <div className="results-header">
        <h2>Top matches</h2>
        <div className="results-meta">
          Searched {totalCities} cities · Showing top {results.length}
        </div>
      </div>

      <div className="results">
        {results.map((r, i) => (
          <CityCard
            key={`${r.city.name}-${r.city.country}`}
            rank={i + 1}
            ranked={r}
          />
        ))}
      </div>
    </section>
  );
}
