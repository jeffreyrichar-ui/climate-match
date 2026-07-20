type Props = {
  current: number;
  total: number;
  section: string;
};

export function ProgressBar({ current, total, section }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span className="progress-section">{section}</span>
        <span className="progress-count">
          Question {current + 1} of {total}
        </span>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
