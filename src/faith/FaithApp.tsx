import { useMemo, useState } from 'react';
import { QUESTIONS, SECTIONS } from './questions';
import { RELIGIONS } from './religions';
import { rankReligions, answeredCount } from './scoring';
import type { Answers } from './types';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultsList } from './ResultsList';

type Phase = 'intro' | 'quiz' | 'results';

export function FaithApp() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const selected = question ? answers[question.id] ?? [] : [];
  const answered = answeredCount(answers);

  const results = useMemo(
    () => (phase === 'results' ? rankReligions(RELIGIONS, answers, 40) : []),
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
        <div className="brand">Faith&nbsp;Match</div>
        <p className="tagline">Explore the world’s religions, sects &amp; spiritual paths</p>
      </header>

      {phase === 'intro' && (
        <section className="faith-intro">
          <h1>Which spiritual traditions resonate with you?</h1>
          <p className="lead">
            Answer up to {total} questions about the divine, truth, purpose, practice, and ethics.
            We’ll compare your answers against{' '}
            <strong>{RELIGIONS.length.toLocaleString()} traditions</strong> — from the major world
            faiths down to specific branches, sects, and orders like Nizari Ismailism, Gaudiya
            Vaishnavism, or Zen — and show which align most closely with how you see the world.
          </p>
          <ul className="intro-points">
            <li>Many questions let you pick several answers — choose whatever resonates.</li>
            <li>Skip anything that doesn’t apply; unanswered questions never count against a path.</li>
            <li>Spans {SECTIONS.length} themes: {SECTIONS.join(' · ')}.</li>
          </ul>
          <div className="disclaimer">
            This is a tool for curiosity and self-reflection, not a verdict on what is true, best, or
            right for you. Every tradition here is described with respect; a “match” simply means its
            outlook echoes your answers.
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
        For exploration and education only — a mirror of your answers, not a judgment. Descriptions
        aim to be accurate and respectful of every tradition.
      </footer>
    </div>
  );
}
