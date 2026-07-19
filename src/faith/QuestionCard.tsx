import type { Question } from './types';

type Props = {
  question: Question;
  selected: string[];
  onSelect: (optionId: string) => void;
};

export function QuestionCard({ question, selected, onSelect }: Props) {
  return (
    <div className="question-card">
      <div className="q-section">{question.section}</div>
      <h2 className="q-prompt">{question.prompt}</h2>
      {question.helpText && <p className="q-help">{question.helpText}</p>}
      <p className="q-mode">
        {question.multiSelect ? 'Choose all that resonate — or none' : 'Choose one — or skip'}
      </p>
      <div className="q-options">
        {question.options.map((o) => {
          const isSel = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              className={`option-chip${isSel ? ' selected' : ''}`}
              aria-pressed={isSel}
              onClick={() => onSelect(o.id)}
            >
              <span className={`option-mark${question.multiSelect ? ' box' : ' round'}`} aria-hidden="true">
                {isSel ? '✓' : ''}
              </span>
              <span className="option-label">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
