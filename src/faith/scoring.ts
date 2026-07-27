import { QUESTIONS } from './questions';
import type { DimensionKey } from './dimensions';
import type {
  Answers,
  DimensionContribution,
  Religion,
  RankedReligion,
  UserVector,
} from './types';

/**
 * Turn the user's raw answers into a normalized preference vector:
 * dimension -> option -> weight in [0, 1] (each answered dimension sums to 1).
 * Questions left unanswered contribute nothing.
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
 * Score one religion against the user vector. Overlap on each dimension the user
 * cares about is the dot product of the two normalized option-distributions
 * (1.0 = identical stance, 0 = no shared stance). The match is the mean overlap
 * across every dimension the user expressed a preference on — so a tradition
 * that is silent on something the user cares about is fairly discounted there.
 */
export function scoreReligion(
  religion: Religion,
  userVector: UserVector,
): { matchPct: number; strengths: DimensionContribution[]; biggestGap?: DimensionContribution } {
  const dims = Object.keys(userVector) as DimensionKey[];
  if (dims.length === 0) return { matchPct: 0, strengths: [] };

  const contributions: DimensionContribution[] = [];
  let total = 0;
  for (const dim of dims) {
    const uv = userVector[dim]!;
    const rvRaw = religion.profile[dim];
    const rv = rvRaw ? normalize(rvRaw) : {};
    const overlap = Object.keys(rv).length ? dot(uv, rv) : 0;
    total += overlap;
    contributions.push({ dimension: dim, overlap, religionTopOption: topOption(rvRaw) });
  }

  const matchPct = clampPct((100 * total) / dims.length);
  const byBest = [...contributions].sort((a, b) => b.overlap - a.overlap);
  const strengths = byBest.filter((c) => c.overlap > 0.15).slice(0, 4);
  const worst = byBest[byBest.length - 1];
  const biggestGap = worst && worst.overlap < 0.4 ? worst : undefined;

  return { matchPct, strengths, biggestGap };
}

/**
 * Rank every religion against the user's answers, best match first.
 * `limit` caps the number returned; pass 0 or Infinity for all.
 */
export function rankReligions(
  religions: readonly Religion[],
  answers: Answers,
  limit = 25,
): RankedReligion[] {
  const userVector = buildUserVector(answers);
  const ranked: RankedReligion[] = religions.map((religion) => {
    const { matchPct, strengths, biggestGap } = scoreReligion(religion, userVector);
    return { religion, matchPct, strengths, biggestGap };
  });
  ranked.sort(
    (a, b) => b.matchPct - a.matchPct || a.religion.name.localeCompare(b.religion.name),
  );
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
