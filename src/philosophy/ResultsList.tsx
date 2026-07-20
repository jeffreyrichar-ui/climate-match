import { useState } from 'react';
import type { RankedSchool } from './types';
import { SchoolCard } from './SchoolCard';

type Props = {
  results: RankedSchool[];
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
        <h2>Schools of thought that resonate with you</h2>
        <p className="results-sub">
          Based on {answered} of {total} answers. These are the philosophies whose outlook most
          closely mirrors yours — an invitation to read and think further, not a verdict on what is
          true.
        </p>
      </div>

      <ol className="results-list">
        {shown.map((r, i) => (
          <SchoolCard key={r.school.id} ranked={r} rank={i + 1} />
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
