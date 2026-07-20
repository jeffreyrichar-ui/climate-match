import { describe, it, expect } from 'vitest';
import { buildUserVector, rankSchools, scoreSchool, answeredCount } from './scoring';
import { QUESTIONS } from './questions';
import { SCHOOLS } from './schools';
import { OPTION_KEYS, isValidOption, DIMENSIONS } from './dimensions';
import type { School } from './types';

const virtueSchool: School = {
  id: 'fx-virtue',
  name: 'Virtue-like',
  category: 'Test',
  branchPath: ['Test', 'Virtue'],
  shortDescription: 'A virtue-ethics fixture.',
  profile: { ethicsBasis: { virtue: 1 }, theGoodLife: { 'virtue-excellence': 1 } },
};
const utilSchool: School = {
  id: 'fx-util',
  name: 'Consequence-like',
  category: 'Test',
  branchPath: ['Test', 'Consequence'],
  shortDescription: 'A consequentialist fixture.',
  profile: { ethicsBasis: { consequences: 1 }, moralScope: { 'all-sentient': 1 } },
};

describe('buildUserVector', () => {
  it('normalizes a single-select answer to a one-hot distribution', () => {
    const uv = buildUserVector({ q_reality: ['matter'] });
    expect(uv.metaphysics).toEqual({ materialism: 1 });
  });

  it('aggregates multi-select answers across options', () => {
    const uv = buildUserVector({ q_purpose: ['projects', 'loved'] });
    expect((uv.meaningSource ?? {})['self-created']).toBeGreaterThan(0);
    expect((uv.meaningSource ?? {})['relationships']).toBeGreaterThan(0);
  });

  it('ignores unanswered questions', () => {
    const uv = buildUserVector({ q_reality: [] });
    expect(Object.keys(uv)).toHaveLength(0);
  });
});

describe('scoreSchool', () => {
  it('gives 100% when the school matches the only answered dimension', () => {
    const uv = buildUserVector({ q_right_wrong: ['virtue'] });
    // only ethicsBasis answered; virtueSchool is one-hot virtue there
    expect(scoreSchool(virtueSchool, uv).matchPct).toBe(100);
  });

  it('gives 0% for the opposite stance', () => {
    const uv = buildUserVector({ q_right_wrong: ['virtue'] });
    expect(scoreSchool(utilSchool, uv).matchPct).toBe(0);
  });
});

describe('rankSchools discrimination', () => {
  const pair = [virtueSchool, utilSchool];

  it('ranks the virtue school first for character-leaning answers', () => {
    const ranked = rankSchools(pair, { q_right_wrong: ['virtue'], q_moral_dilemma: ['character'] });
    expect(ranked[0].school.id).toBe('fx-virtue');
  });

  it('ranks the consequentialist school first for outcome-leaning answers', () => {
    const ranked = rankSchools(pair, { q_right_wrong: ['outcomes'], q_moral_dilemma: ['best'] });
    expect(ranked[0].school.id).toBe('fx-util');
  });

  it('respects the limit', () => {
    expect(rankSchools(pair, { q_right_wrong: ['virtue'] }, 1)).toHaveLength(1);
  });

  it('returns 0% everywhere when nothing is answered', () => {
    expect(rankSchools(pair, {}).every((r) => r.matchPct === 0)).toBe(true);
  });
});

// Stoic-vs-Epicurean style separation via the good-life / desire axes.
describe('good-life discrimination', () => {
  const stoic: School = {
    id: 'fx-stoic', name: 'Stoic-like', category: 'Test', branchPath: ['Test', 'Stoic'],
    shortDescription: 'x',
    profile: { theGoodLife: { 'virtue-excellence': 1 }, desireStance: { master: 1 }, worldStance: { ascetic: 1 } },
  };
  const epicurean: School = {
    id: 'fx-epicurean', name: 'Epicurean-like', category: 'Test', branchPath: ['Test', 'Epicurean'],
    shortDescription: 'x',
    profile: { theGoodLife: { pleasure: 1 }, desireStance: { moderate: 1 }, worldStance: { affirming: 1 } },
  };
  const pair = [stoic, epicurean];

  it('virtue/discipline answers rank the Stoic school first', () => {
    const ranked = rankSchools(pair, { q_highest_good: ['virtue'], q_desire: ['master'], q_pleasure_view: ['discipline'] });
    expect(ranked[0].school.id).toBe('fx-stoic');
  });

  it('pleasure answers rank the Epicurean school first', () => {
    const ranked = rankSchools(pair, { q_highest_good: ['pleasure'], q_desire: ['moderate'], q_pleasure_view: ['embrace'] });
    expect(ranked[0].school.id).toBe('fx-epicurean');
  });
});

describe('answeredCount', () => {
  it('counts only answered questions', () => {
    expect(answeredCount({ q_reality: ['matter'], q_desire: [] })).toBe(1);
  });
});

describe('question data integrity', () => {
  it('has unique question ids', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique option ids within each question', () => {
    for (const q of QUESTIONS) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size, `dup option in ${q.id}`).toBe(ids.length);
    }
  });

  it('every contribution references a valid dimension and option', () => {
    for (const q of QUESTIONS) {
      for (const opt of q.options) {
        for (const c of opt.contributions) {
          expect(OPTION_KEYS[c.dimension], `bad dimension ${c.dimension} in ${q.id}`).toBeDefined();
          expect(
            isValidOption(c.dimension, c.option),
            `bad option ${c.dimension}.${c.option} in ${q.id}/${opt.id}`,
          ).toBe(true);
          expect(Number.isFinite(c.weight)).toBe(true);
        }
      }
    }
  });

  it('covers every dimension at least once', () => {
    const covered = new Set<string>();
    for (const q of QUESTIONS)
      for (const o of q.options) for (const c of o.contributions) covered.add(c.dimension);
    for (const d of DIMENSIONS) expect(covered.has(d.key), `dimension ${d.key} never used`).toBe(true);
  });
});

describe('school data integrity', () => {
  it('ships a substantial catalog', () => {
    expect(SCHOOLS.length).toBeGreaterThanOrEqual(80);
  });

  it('has unique ids', () => {
    const ids = SCHOOLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every profile references only valid dimension and option keys', () => {
    for (const s of SCHOOLS) {
      for (const dim of Object.keys(s.profile)) {
        expect(OPTION_KEYS[dim as keyof typeof OPTION_KEYS], `bad dimension ${dim} in ${s.id}`).toBeDefined();
        const bucket = s.profile[dim as keyof typeof s.profile]!;
        for (const opt of Object.keys(bucket)) {
          expect(isValidOption(dim, opt), `bad option ${dim}.${opt} in ${s.id}`).toBe(true);
          expect(Number.isFinite(bucket[opt]) && bucket[opt] > 0, `bad weight in ${s.id}`).toBe(true);
        }
      }
    }
  });

  it('every entry has a non-empty branch path and description', () => {
    for (const s of SCHOOLS) {
      expect(s.branchPath.length, `empty branchPath in ${s.id}`).toBeGreaterThan(0);
      expect(s.shortDescription.length, `empty description in ${s.id}`).toBeGreaterThan(0);
    }
  });
});
