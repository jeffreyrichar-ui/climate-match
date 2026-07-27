import { useMemo, useState } from 'react';
import { SECTIONS } from './questions';
import { SCHOOLS } from './schools';
import { rankSchools, answeredCount } from './scoring';
import { visibleQuestions, pruneHiddenAnswers } from './flow';
import type { Answers } from './types';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultsList } from './ResultsList';

type Phase = 'intro' | 'quiz' | 'results';

export function PhilosophyApp() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  // The decision-tree path: recomputed whenever answers change, so follow-up
  // questions appear or disappear based on what the user picked.
  const path = useMemo(() => visibleQuestions(answers), [answers]);
  const total = path.length;
  const question = path[Math.min(index, total - 1)];
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
      // Changing an answer can close branches downstream — drop those answers
      // so the results only reflect the path the user actually walked.
      return pruneHiddenAnswers({ ...prev, [question.id]: next });
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
        <p className="tagline">Find the ways of thinking that fit how you see the world</p>
      </header>

      {phase === 'intro' && (
        <section className="faith-intro">
          <h1>Which philosophies of life fit you?</h1>
          <p className="lead">
            Answer some easy questions about what’s real, what makes a good life, right and wrong,
            freedom, and meaning. We’ll match your answers against{' '}
            <strong>{SCHOOLS.length.toLocaleString()} schools of thought</strong> — from Stoicism
            and Epicureanism to Existentialism, Taoism, and Effective Altruism — and show which
            ones think the way you do.
          </p>
          <ul className="intro-points">
            <li>It works like a decision tree: your answers choose which questions come next.</li>
            <li>No gods involved — every school here stands on reason, experience, or nature.</li>
            <li>Not sure about one? Skip it. Skipping never counts against a match.</li>
            <li>Covers {SECTIONS.length} themes: {SECTIONS.join(' · ')}.</li>
          </ul>
          <div className="disclaimer">
            This is for curiosity and self-discovery — not a test with right answers, and not a
            verdict on which philosophy is correct. A “match” just means a school’s ideas sound
            like yours. Great starting points for reading more.
          </div>
          <button className="btn primary big" onClick={begin}>
            Start →
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
          onRestart={restart}
          onRefine={() => {
            setIndex(0);
            setPhase('quiz');
          }}
        />
      )}

      <footer className="faith-footer">
        For fun and exploration — a mirror of your answers, not a judgment of which philosophy is
        true. Every school is described fairly and even-handedly.
      </footer>
    </div>
  );
}
