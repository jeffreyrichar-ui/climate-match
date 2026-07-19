import { describe, it, expect } from 'vitest';
import { buildUserVector, rankReligions, scoreReligion, answeredCount } from './scoring';
import { QUESTIONS } from './questions';
import { RELIGIONS } from './religions';
import { OPTION_KEYS, isValidOption, DIMENSIONS } from './dimensions';
import type { Religion } from './types';

const mono: Religion = {
  id: 'test-mono',
  name: 'Test Monotheism',
  traditionFamily: 'Test',
  branchPath: ['Test', 'Mono'],
  shortDescription: 'A test tradition centered on one personal God.',
  profile: {
    theism: { monotheism: 1 },
    divineNature: { personal: 1 },
    afterlife: { 'heaven-hell': 1 },
  },
};

const poly: Religion = {
  id: 'test-poly',
  name: 'Test Polytheism',
  traditionFamily: 'Test',
  branchPath: ['Test', 'Poly'],
  shortDescription: 'A test tradition centered on many gods.',
  profile: {
    theism: { polytheism: 1 },
    divineNature: { impersonal: 1 },
    afterlife: { reincarnation: 1 },
  },
};

const nontheist: Religion = {
  id: 'test-non',
  name: 'Test Nontheism',
  traditionFamily: 'Test',
  branchPath: ['Test', 'None'],
  shortDescription: 'A test worldview with no gods.',
  profile: {
    theism: { nontheism: 1 },
    divineNature: { none: 1 },
    afterlife: { none: 1 },
  },
};

describe('buildUserVector', () => {
  it('normalizes a single-select answer to a one-hot distribution', () => {
    const uv = buildUserVector({ q_god_count: ['one'] });
    expect(uv.theism).toEqual({ monotheism: 1 });
  });

  it('aggregates multi-select answers across options', () => {
    // Both options push onto `authority`; result should carry both, summing to 1.
    const uv = buildUserVector({ q_authority: ['scripture', 'tradition'] });
    expect(Object.keys(uv.authority ?? {}).sort()).toEqual(['scripture', 'tradition']);
    const sum = Object.values(uv.authority ?? {}).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
    expect(uv.authority?.scripture).toBeCloseTo(0.5, 5);
  });

  it('ignores unanswered / empty questions', () => {
    const uv = buildUserVector({ q_god_count: [], q_ritual: undefined as unknown as string[] });
    expect(Object.keys(uv)).toHaveLength(0);
  });
});

describe('scoreReligion', () => {
  it('gives ~100% when the religion matches the only answered dimension', () => {
    const uv = buildUserVector({ q_god_count: ['one'] });
    expect(scoreReligion(mono, uv).matchPct).toBe(100);
  });

  it('gives 0% when the religion holds the opposite stance', () => {
    const uv = buildUserVector({ q_god_count: ['one'] });
    expect(scoreReligion(poly, uv).matchPct).toBe(0);
  });

  it('only counts dimensions the user expressed a preference on', () => {
    // Answer just the god-count question; mono matches on theism -> 100%,
    // even though it also profiles other dimensions the user skipped.
    const uv = buildUserVector({ q_god_count: ['one'] });
    expect(scoreReligion(mono, uv).matchPct).toBe(100);
  });

  it('reports strengths for aligned dimensions', () => {
    const uv = buildUserVector({ q_god_count: ['one'], q_divine_personal: ['personal'] });
    const { matchPct, strengths } = scoreReligion(mono, uv);
    expect(matchPct).toBe(100);
    expect(strengths.map((s) => s.dimension).sort()).toEqual(['divineNature', 'theism']);
  });
});

describe('rankReligions', () => {
  const all = [mono, poly, nontheist];

  it('ranks the best-matching tradition first', () => {
    const ranked = rankReligions(all, { q_god_count: ['one'], q_divine_personal: ['personal'] });
    expect(ranked[0].religion.id).toBe('test-mono');
    expect(ranked[0].matchPct).toBeGreaterThan(ranked[1].matchPct);
  });

  it('surfaces a nontheist path for nontheist answers', () => {
    const ranked = rankReligions(all, { q_god_count: ['no-gods'], q_divine_personal: ['na'] });
    expect(ranked[0].religion.id).toBe('test-non');
  });

  it('respects the limit', () => {
    const ranked = rankReligions(all, { q_god_count: ['one'] }, 2);
    expect(ranked).toHaveLength(2);
  });

  it('returns 0% everywhere when nothing is answered', () => {
    const ranked = rankReligions(all, {});
    expect(ranked.every((r) => r.matchPct === 0)).toBe(true);
  });
});

describe('answeredCount', () => {
  it('counts only answered questions', () => {
    expect(answeredCount({ q_god_count: ['one'], q_ritual: [] })).toBe(1);
  });
});

describe('discrimination via the new temperament dimensions', () => {
  // Two secular fixtures that differ mainly on desire/world stance — the axes
  // that separate Stoic-style from Epicurean-style ways of life.
  const stoicLike: Religion = {
    id: 'fx-stoic',
    name: 'Stoic-like',
    traditionFamily: 'Nontheistic & Philosophical',
    branchPath: ['Nontheistic & Philosophical', 'Stoic-like'],
    shortDescription: 'A discipline-of-the-passions fixture.',
    profile: {
      desireStance: { master: 1 },
      worldStance: { ascetic: 1 },
      ethicalFocus: { 'self-mastery': 1 },
      moralSource: { 'natural-law': 1 },
    },
  };
  const epicureanLike: Religion = {
    id: 'fx-epicurean',
    name: 'Epicurean-like',
    traditionFamily: 'Nontheistic & Philosophical',
    branchPath: ['Nontheistic & Philosophical', 'Epicurean-like'],
    shortDescription: 'A tranquil-pleasure fixture.',
    profile: {
      desireStance: { moderate: 1 },
      worldStance: { affirming: 1 },
      ethicalFocus: { 'self-mastery': 1 },
      meaningSource: { 'self-created': 1 },
    },
  };
  const pair = [stoicLike, epicureanLike];

  it('ranks the Stoic-like path first for discipline-leaning answers', () => {
    const ranked = rankReligions(pair, {
      q_desire_stance: ['master'],
      q_good_life: ['stoic'],
      q_worldliness: ['discipline'],
    });
    expect(ranked[0].religion.id).toBe('fx-stoic');
    expect(ranked[0].matchPct).toBeGreaterThan(ranked[1].matchPct);
  });

  it('ranks the Epicurean-like path first for pleasure-leaning answers', () => {
    const ranked = rankReligions(pair, {
      q_desire_stance: ['moderate'],
      q_good_life: ['epicurean'],
      q_worldliness: ['embrace'],
    });
    expect(ranked[0].religion.id).toBe('fx-epicurean');
    expect(ranked[0].matchPct).toBeGreaterThan(ranked[1].matchPct);
  });
});

// ─────────────────── data integrity of the shipped content ───────────────────

describe('question data integrity', () => {
  it('has unique question ids', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique option ids within each question', () => {
    for (const q of QUESTIONS) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size, `duplicate option id in ${q.id}`).toBe(ids.length);
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

describe('religion data integrity', () => {
  it('ships a large, granular catalog', () => {
    expect(RELIGIONS.length).toBeGreaterThanOrEqual(300);
  });

  it('has unique ids and names', () => {
    const ids = RELIGIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every profile references only valid dimension and option keys', () => {
    for (const r of RELIGIONS) {
      for (const dim of Object.keys(r.profile)) {
        expect(OPTION_KEYS[dim as keyof typeof OPTION_KEYS], `bad dimension ${dim} in ${r.id}`).toBeDefined();
        const bucket = r.profile[dim as keyof typeof r.profile]!;
        for (const opt of Object.keys(bucket)) {
          expect(isValidOption(dim, opt), `bad option ${dim}.${opt} in ${r.id}`).toBe(true);
          expect(Number.isFinite(bucket[opt]) && bucket[opt] > 0, `bad weight in ${r.id}`).toBe(true);
        }
      }
    }
  });

  it('every entry has a non-empty branch path and description', () => {
    for (const r of RELIGIONS) {
      expect(r.branchPath.length, `empty branchPath in ${r.id}`).toBeGreaterThan(0);
      expect(r.shortDescription.length, `empty description in ${r.id}`).toBeGreaterThan(0);
    }
  });
});
