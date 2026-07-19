import { DIMENSION_BY_KEY, optionLabel } from './dimensions';
import type { RankedReligion } from './types';

type Props = {
  ranked: RankedReligion;
  rank: number;
};

export function ReligionCard({ ranked, rank }: Props) {
  const { religion, matchPct, strengths } = ranked;
  const wiki = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(religion.name)}`;

  return (
    <li className="result-card">
      <div className="rc-rank">{rank}</div>
      <div className="rc-body">
        <div className="rc-top">
          <h3 className="rc-name">{religion.name}</h3>
          <div className="rc-match" title={`${matchPct}% alignment with your answers`}>
            <span className="rc-pct">{matchPct}%</span>
            <span className="rc-pct-label">match</span>
          </div>
        </div>

        {religion.aka && <div className="rc-aka">{religion.aka}</div>}
        <div className="rc-breadcrumb">{religion.branchPath.join(' ▸ ')}</div>
        <p className="rc-desc">{religion.shortDescription}</p>

        <div className="rc-meta">
          <span className="family-badge">{religion.traditionFamily}</span>
          {religion.approxAdherents && <span className="meta-pill">{religion.approxAdherents}</span>}
          {religion.primaryRegions && <span className="meta-pill">{religion.primaryRegions}</span>}
          {religion.foundedEra && <span className="meta-pill">{religion.foundedEra}</span>}
        </div>

        {strengths.length > 0 && (
          <div className="rc-strengths">
            <span className="rc-why">Why it fits</span>
            {strengths.map((s) => (
              <span className="chip" key={s.dimension}>
                {DIMENSION_BY_KEY[s.dimension].label}: {optionLabel(s.dimension, s.religionTopOption)}
              </span>
            ))}
          </div>
        )}

        <a className="rc-link" href={wiki} target="_blank" rel="noreferrer">
          Learn more about {religion.name} ↗
        </a>
      </div>

      <div className="rc-bar" aria-hidden="true">
        <div className="rc-bar-fill" style={{ width: `${matchPct}%` }} />
      </div>
    </li>
  );
}
