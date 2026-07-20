import { QUESTIONS } from './questions';
import type { Answers, Question } from './types';

/**
 * The decision-tree layer. Questions without `showIf` are gateways and always
 * appear; questions with `showIf` appear only when every condition passes
 * against the current answers. Scoring already ignores unanswered questions, so
 * branching is purely a matter of which questions get shown.
 */

function conditionsPass(q: Question, answers: Answers): boolean {
  if (!q.showIf || q.showIf.length === 0) return true;
  return q.showIf.every((c) => {
    const chosen = answers[c.questionId];
    if (!chosen || chosen.length === 0) return false;
    return chosen.some((opt) => c.anyOf.includes(opt));
  });
}

/** The questions on the user's current path, in order. */
export function visibleQuestions(answers: Answers): Question[] {
  // Evaluate in sequence so a follow-up can depend on any earlier question,
  // including another follow-up: conditions read the same `answers` object,
  // and hidden questions' answers are pruned by pruneHiddenAnswers.
  return QUESTIONS.filter((q) => conditionsPass(q, answers));
}

/**
 * Drop answers to questions that are no longer on the path (their gate closed
 * after an upstream answer changed). Iterates to a fixed point so a chain of
 * follow-ups collapses cleanly. Returns the same object if nothing changed.
 */
export function pruneHiddenAnswers(answers: Answers): Answers {
  let current = answers;
  for (let pass = 0; pass < QUESTIONS.length; pass++) {
    const visible = new Set(visibleQuestions(current).map((q) => q.id));
    const orphaned = Object.keys(current).filter(
      (id) => !visible.has(id) && (current[id]?.length ?? 0) > 0,
    );
    if (orphaned.length === 0) return current;
    const next: Answers = { ...current };
    for (const id of orphaned) delete next[id];
    current = next;
  }
  return current;
}
