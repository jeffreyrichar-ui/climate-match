import { DIMENSION_BY_KEY, optionLabel } from './dimensions';
import type { RankedSchool } from './types';

type Props = {
  ranked: RankedSchool;
  rank: number;
};

export function SchoolCard({ ranked, rank }: Props) {
  const { school, matchPct, strengths } = ranked;
  const wiki = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(school.name + ' philosophy')}`;

  return (
    <li className="result-card">
      <div className="rc-rank">{rank}</div>
      <div className="rc-body">
        <div className="rc-top">
          <h3 className="rc-name">{school.name}</h3>
          <div className="rc-match" title={`${matchPct}% alignment with your answers`}>
            <span className="rc-pct">{matchPct}%</span>
            <span className="rc-pct-label">match</span>
          </div>
        </div>

        {school.aka && <div className="rc-aka">{school.aka}</div>}
        <div className="rc-breadcrumb">{school.branchPath.join(' ▸ ')}</div>
        <p className="rc-desc">{school.shortDescription}</p>

        {school.keyThinkers && <div className="rc-thinkers">Key thinkers: {school.keyThinkers}</div>}

        <div className="rc-meta">
          <span className="family-badge">{school.category}</span>
          {school.era && <span className="meta-pill">{school.era}</span>}
          {school.region && <span className="meta-pill">{school.region}</span>}
        </div>

        {strengths.length > 0 && (
          <div className="rc-strengths">
            <span className="rc-why">Why it fits</span>
            {strengths.map((s) => (
              <span className="chip" key={s.dimension}>
                {DIMENSION_BY_KEY[s.dimension].label}: {optionLabel(s.dimension, s.schoolTopOption)}
              </span>
            ))}
          </div>
        )}

        <a className="rc-link" href={wiki} target="_blank" rel="noreferrer">
          Learn more about {school.name} ↗
        </a>
      </div>

      <div className="rc-bar" aria-hidden="true">
        <div className="rc-bar-fill" style={{ width: `${matchPct}%` }} />
      </div>
    </li>
  );
}
