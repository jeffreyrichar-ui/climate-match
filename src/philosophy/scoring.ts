import { QUESTIONS } from './questions';
import type { DimensionKey } from './dimensions';
import type {
  Answers,
  DimensionContribution,
  School,
  RankedSchool,
  UserVector,
} from './types';

/**
 * Turn the user's raw answers into a normalized preference vector:
 * dimension -> option -> weight in [0, 1] (each answered dimension sums to 1).
 */
export function buildUserVector(answers: Answers): UserVector {
  const raw: Partial<Record<DimensionKey, Record<string, number>>> = {};
  for (const q of QUESTIONS) {
    const chosen = answers[q.id];
    if (!chosen || chosen.length === 0) continue;
    for (const optId of chosen) {
      const opt = q.options.find((o) => o.id === optId);
      if (!opt) continue;
      for (const c of opt.contributions) {
        if (!c.weight) continue;
        const bucket = (raw[c.dimension] ??= {});
        bucket[c.option] = (bucket[c.option] ?? 0) + c.weight;
      }
    }
  }
  const out: UserVector = {};
  for (const key of Object.keys(raw) as DimensionKey[]) {
    const normalized = normalize(raw[key]!);
    if (Object.keys(normalized).length) out[key] = normalized;
  }
  return out;
}

/** Number of questions the user actually answered. */
export function answeredCount(answers: Answers): number {
  return QUESTIONS.reduce((n, q) => n + ((answers[q.id]?.length ?? 0) > 0 ? 1 : 0), 0);
}

/**
 * Score one school against the user vector. Overlap on each dimension the user
 * cares about is the dot product of the two normalized option-distributions; the
 * match is the mean overlap across every dimension the user expressed a
 * preference on.
 */
export function scoreSchool(
  school: School,
  userVector: UserVector,
): { matchPct: number; strengths: DimensionContribution[]; biggestGap?: DimensionContribution } {
  const dims = Object.keys(userVector) as DimensionKey[];
  if (dims.length === 0) return { matchPct: 0, strengths: [] };

  const contributions: DimensionContribution[] = [];
  let total = 0;
  for (const dim of dims) {
    const uv = userVector[dim]!;
    const svRaw = school.profile[dim];
    const sv = svRaw ? normalize(svRaw) : {};
    const overlap = Object.keys(sv).length ? dot(uv, sv) : 0;
    total += overlap;
    contributions.push({ dimension: dim, overlap, schoolTopOption: topOption(svRaw) });
  }

  const matchPct = clampPct((100 * total) / dims.length);
  const byBest = [...contributions].sort((a, b) => b.overlap - a.overlap);
  const strengths = byBest.filter((c) => c.overlap > 0.15).slice(0, 4);
  const worst = byBest[byBest.length - 1];
  const biggestGap = worst && worst.overlap < 0.4 ? worst : undefined;

  return { matchPct, strengths, biggestGap };
}

/** Rank every school against the user's answers, best match first. */
export function rankSchools(
  schools: readonly School[],
  answers: Answers,
  limit = 25,
): RankedSchool[] {
  const userVector = buildUserVector(answers);
  const ranked: RankedSchool[] = schools.map((school) => {
    const { matchPct, strengths, biggestGap } = scoreSchool(school, userVector);
    return { school, matchPct, strengths, biggestGap };
  });
  ranked.sort((a, b) => b.matchPct - a.matchPct || a.school.name.localeCompare(b.school.name));
  return limit && limit > 0 ? ranked.slice(0, limit) : ranked;
}

// ───────────────────────────── helpers ─────────────────────────────

function normalize(map: Record<string, number>): Record<string, number> {
  let sum = 0;
  for (const k in map) sum += map[k];
  if (sum <= 0) return {};
  const out: Record<string, number> = {};
  for (const k in map) out[k] = map[k] / sum;
  return out;
}

function dot(a: Record<string, number>, b: Record<string, number>): number {
  let s = 0;
  for (const k in a) {
    const bv = b[k];
    if (bv) s += a[k] * bv;
  }
  return s;
}

function topOption(map?: Record<string, number>): string {
  if (!map) return '';
  let best = '';
  let bestWeight = -Infinity;
  for (const k in map) {
    if (map[k] > bestWeight) {
      bestWeight = map[k];
      best = k;
    }
  }
  return best;
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
