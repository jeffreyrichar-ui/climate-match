import { describe, it, expect } from 'vitest';
import { visibleQuestions, pruneHiddenAnswers } from './flow';
import { QUESTIONS } from './questions';

const gateways = QUESTIONS.filter((q) => !q.showIf || q.showIf.length === 0);
const followUps = QUESTIONS.filter((q) => q.showIf && q.showIf.length > 0);

describe('visibleQuestions', () => {
  it('shows only gateways when nothing is answered', () => {
    const visible = visibleQuestions({});
    expect(visible.map((q) => q.id)).toEqual(gateways.map((q) => q.id));
  });

  it('opens a follow-up when its gateway answer matches', () => {
    const before = visibleQuestions({}).map((q) => q.id);
    expect(before).not.toContain('q_science');
    const after = visibleQuestions({ q_stuff: ['physical'] }).map((q) => q.id);
    expect(after).toContain('q_science');
    expect(after).toContain('q_brain');
    // The mind-branch follow-up stays closed on the physical branch.
    expect(after).not.toContain('q_ideas_real');
    expect(after).not.toContain('q_doubt');
  });

  it('switches branches when the gateway answer changes', () => {
    const mindPath = visibleQuestions({ q_stuff: ['mind'] }).map((q) => q.id);
    expect(mindPath).toContain('q_ideas_real');
    expect(mindPath).not.toContain('q_science');
  });

  it('keeps follow-ups in document order within the path', () => {
    const ids = visibleQuestions({ q_stuff: ['physical'], q_good_life: ['enjoy'] }).map((q) => q.id);
    expect(ids.indexOf('q_science')).toBeGreaterThan(ids.indexOf('q_stuff'));
    expect(ids.indexOf('q_enjoy_style')).toBeGreaterThan(ids.indexOf('q_good_life'));
  });
});

describe('pruneHiddenAnswers', () => {
  it('drops answers to follow-ups whose branch closed', () => {
    const pruned = pruneHiddenAnswers({ q_stuff: ['mind'], q_brain: ['yes'] });
    expect(pruned.q_brain).toBeUndefined();
    expect(pruned.q_stuff).toEqual(['mind']);
  });

  it('keeps answers that are still on the path', () => {
    const answers = { q_stuff: ['physical'], q_brain: ['yes'] };
    expect(pruneHiddenAnswers(answers)).toBe(answers);
  });

  it('drops follow-up answers when the gateway is cleared', () => {
    const pruned = pruneHiddenAnswers({ q_stuff: [], q_science: ['all-the-way'] });
    expect(pruned.q_science).toBeUndefined();
  });
});

describe('tree integrity', () => {
  it('has at least one gateway per section and a sensible split', () => {
    expect(gateways.length).toBeGreaterThanOrEqual(15);
    expect(followUps.length).toBeGreaterThanOrEqual(8);
  });

  it('every showIf references an EARLIER question and real option ids', () => {
    const indexById = new Map(QUESTIONS.map((q, i) => [q.id, i]));
    for (const q of followUps) {
      for (const cond of q.showIf!) {
        const refIndex = indexById.get(cond.questionId);
        expect(refIndex, `${q.id} references unknown ${cond.questionId}`).toBeDefined();
        expect(refIndex!, `${q.id} must come after ${cond.questionId}`).toBeLessThan(
          indexById.get(q.id)!,
        );
        const ref = QUESTIONS[refIndex!];
        const validOptions = new Set(ref.options.map((o) => o.id));
        for (const opt of cond.anyOf) {
          expect(validOptions.has(opt), `${q.id}: ${cond.questionId} has no option ${opt}`).toBe(true);
        }
        expect(cond.anyOf.length).toBeGreaterThan(0);
      }
    }
  });

  it('no follow-up depends on another follow-up (single-hop tree)', () => {
    const followUpIds = new Set(followUps.map((q) => q.id));
    for (const q of followUps) {
      for (const cond of q.showIf!) {
        expect(followUpIds.has(cond.questionId), `${q.id} chains off ${cond.questionId}`).toBe(false);
      }
    }
  });

  it('every follow-up is reachable by some gateway answer', () => {
    for (const q of followUps) {
      // Build an answer set that satisfies every condition, then check visibility.
      const answers: Record<string, string[]> = {};
      for (const cond of q.showIf!) answers[cond.questionId] = [cond.anyOf[0]];
      const visible = visibleQuestions(answers).map((v) => v.id);
      expect(visible, `${q.id} is unreachable`).toContain(q.id);
    }
  });
});
