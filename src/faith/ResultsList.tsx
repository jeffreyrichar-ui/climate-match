import { useState } from 'react';
import type { RankedReligion } from './types';
import { ReligionCard } from './ReligionCard';

type Props = {
  results: RankedReligion[];
  answered: number;
  total: number;
  onRestart: () => void;
  onRefine: () => void;
};

const INITIAL = 12;

export function ResultsList({ results, answered, total, onRestart, onRefine }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (answered === 0) {
    return (
      <section className="faith-results">
        <div className="results-empty">
          <p>You haven’t answered any questions yet, so there’s nothing to match against.</p>
          <button className="btn primary" onClick={onRefine}>
            Take the questionnaire
          </button>
        </div>
      </section>
    );
  }

  const shown = showAll ? results : results.slice(0, INITIAL);

  return (
    <section className="faith-results">
      <div className="results-head">
        <h2>Traditions that resonate with you</h2>
        <p className="results-sub">
          Based on {answered} of {total} answers. These are the paths whose worldview most closely
          mirrors yours — an invitation to explore and learn, never a judgment of what is true or best.
        </p>
      </div>

      <ol className="results-list">
        {shown.map((r, i) => (
          <ReligionCard key={r.religion.id} ranked={r} rank={i + 1} />
        ))}
      </ol>

      {!showAll && results.length > shown.length && (
        <button className="btn ghost wide" onClick={() => setShowAll(true)}>
          Show more matches ({results.length - shown.length} more)
        </button>
      )}

      <div className="results-actions">
        <button className="btn ghost" onClick={onRefine}>
          ← Adjust my answers
        </button>
        <button className="btn primary" onClick={onRestart}>
          Start over
        </button>
      </div>
    </section>
  );
}
