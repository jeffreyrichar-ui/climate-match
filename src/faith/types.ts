import type { DimensionKey } from './dimensions';

/**
 * A stance vector over the belief dimensions. For each dimension the tradition
 * cares about, a map from option key -> weight (how strongly the tradition holds
 * that position). Most entries are effectively one-hot, but a tradition can
 * spread weight across a couple of positions where it genuinely straddles them.
 * Dimensions a tradition is neutral on are simply omitted.
 */
export type Profile = Partial<Record<DimensionKey, Record<string, number>>>;

/** One religion, denomination, sect, or spiritual path in the catalog. */
export type Religion = {
  id: string;
  name: string;
  /** Alternate names / native names, comma-friendly display string. */
  aka?: string;
  /** Broad tradition family, e.g. "Islam", "Christianity", "Buddhism". */
  traditionFamily: string;
  /**
   * Path from broad family down to this entry, e.g.
   * ["Islam", "Shia", "Ismaili", "Nizari"]. Rendered as a breadcrumb.
   */
  branchPath: readonly string[];
  shortDescription: string;
  /** Human-readable adherent estimate, e.g. "~15 million". */
  approxAdherents?: string;
  /** Primary regions, e.g. "South Asia, East Africa". */
  primaryRegions?: string;
  /** When it took shape, e.g. "8th century CE". */
  foundedEra?: string;
  profile: Profile;
};

/** A single contribution from a question option onto a belief dimension. */
export type Contribution = {
  dimension: DimensionKey;
  option: string;
  weight: number;
};

/** One selectable answer within a question. */
export type QuestionOption = {
  id: string;
  label: string;
  contributions: readonly Contribution[];
};

export type Question = {
  id: string;
  section: string;
  prompt: string;
  helpText?: string;
  /** When true the user may select more than one option. */
  multiSelect: boolean;
  options: readonly QuestionOption[];
};

/**
 * The user's raw answers: question id -> set of chosen option ids. A question
 * absent from the map (or mapping to an empty array) was skipped / "no
 * preference" and contributes nothing.
 */
export type Answers = Record<string, string[]>;

/**
 * Aggregated, normalized user preference over dimensions:
 * dimension -> option -> weight in [0, 1] (each dimension sums to 1 when the
 * user expressed any preference on it).
 */
export type UserVector = Partial<Record<DimensionKey, Record<string, number>>>;

/** Per-dimension breakdown of how well a religion matched the user. */
export type DimensionContribution = {
  dimension: DimensionKey;
  /** Overlap in [0, 1] between user and religion on this dimension. */
  overlap: number;
  /** The religion's top option on this dimension, for display. */
  religionTopOption: string;
};

export type RankedReligion = {
  religion: Religion;
  /** Overall match, 0–100. */
  matchPct: number;
  /** Dimensions where user and religion aligned best (desc by overlap). */
  strengths: DimensionContribution[];
  /** The dimension where they diverged most (may be undefined). */
  biggestGap?: DimensionContribution;
};
