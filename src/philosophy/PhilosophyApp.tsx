import { useMemo, useState } from 'react';
import { QUESTIONS, SECTIONS } from './questions';
import { SCHOOLS } from './schools';
import { rankSchools, answeredCount } from './scoring';
import type { Answers } from './types';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultsList } from './ResultsList';

type Phase = 'intro' | 'quiz' | 'results';

export function PhilosophyApp() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const selected = question ? answers[question.id] ?? [] : [];
  const answered = answeredCount(answers);

  const results = useMemo(
    () => (phase === 'results' ? rankSchools(SCHOOLS, answers, 40) : []),
    [phase, answers],
  );

  function select(optionId: string) {
    if (!question) return;
    setAnswers((prev) => {
      const cur = prev[question.id] ?? [];
      let next: string[];
      if (question.multiSelect) {
        next = cur.includes(optionId) ? cur.filter((x) => x !== optionId) : [...cur, optionId];
      } else {
        next = cur.includes(optionId) ? [] : [optionId];
      }
      return { ...prev, [question.id]: next };
    });
  }

  function goNext() {
    if (index + 1 < total) setIndex(index + 1);
    else setPhase('results');
  }

  function goBack() {
    if (index > 0) setIndex(index - 1);
    else setPhase('intro');
  }

  function begin() {
    setIndex(0);
    setPhase('quiz');
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setPhase('intro');
  }

  const nextLabel = selected.length === 0 ? 'Skip →' : index + 1 === total ? 'See results →' : 'Next →';

  return (
    <div className="faith-app">
      <header className="faith-header">
        <div className="brand">Philosophy&nbsp;Match</div>
        <p className="tagline">Find the schools of thought that fit how you see the world</p>
      </header>

      {phase === 'intro' && (
        <section className="faith-intro">
          <h1>Which philosophies of life resonate with you?</h1>
          <p className="lead">
            Answer up to {total} questions about reality, knowledge, the good life, ethics, freedom,
            and meaning. We’ll compare your answers against{' '}
            <strong>{SCHOOLS.length.toLocaleString()} non-theistic philosophical schools</strong> —
            from Stoicism and Epicureanism to Existentialism, Utilitarianism, Daoism, and Effective
            Altruism — and show which ones most closely match how you think.
          </p>
          <ul className="intro-points">
            <li>No gods required — every school here stands on reason, experience, or nature.</li>
            <li>Some questions let you pick several answers; skip anything that doesn’t fit.</li>
            <li>Spans {SECTIONS.length} themes: {SECTIONS.join(' · ')}.</li>
          </ul>
          <div className="disclaimer">
            This is a tool for curiosity and self-reflection, not a verdict on which philosophy is
            correct. Each school is described neutrally; a “match” simply means its ideas echo your
            answers — a starting point for reading more.
          </div>
          <button className="btn primary big" onClick={begin}>
            Begin the questionnaire →
          </button>
        </section>
      )}

      {phase === 'quiz' && question && (
        <section className="faith-quiz">
          <ProgressBar current={index} total={total} section={question.section} />
          <QuestionCard question={question} selected={selected} onSelect={select} />
          <div className="nav-row">
            <button className="btn ghost" onClick={goBack}>
              ← Back
            </button>
            <span className="answered-count">{answered} answered</span>
            <button className="btn primary" onClick={goNext}>
              {nextLabel}
            </button>
          </div>
          {index + 1 !== total && (
            <button className="btn link" onClick={() => setPhase('results')}>
              Skip ahead to my results
            </button>
          )}
        </section>
      )}

      {phase === 'results' && (
        <ResultsList
          results={results}
          answered={answered}
          total={total}
          onRestart={restart}
          onRefine={() => setPhase('quiz')}
        />
      )}

      <footer className="faith-footer">
        For exploration and education only — a mirror of your answers, not a judgment of which
        philosophy is true. Descriptions aim to be accurate and even-handed.
      </footer>
    </div>
  );
}
