import type { DimensionKey } from './dimensions';

/**
 * A stance vector over the philosophy dimensions. For each dimension the school
 * takes a position on, a map from option key -> weight. Dimensions a school is
 * genuinely silent on are omitted.
 */
export type Profile = Partial<Record<DimensionKey, Record<string, number>>>;

/** One philosophical school, position, or way of life in the catalog. */
export type School = {
  id: string;
  name: string;
  /** Alternate names, comma-friendly display string. */
  aka?: string;
  /** Broad category, e.g. "Hellenistic", "Modern Secular", "Chinese". */
  category: string;
  /** Lineage from broad category to this entry, rendered as a breadcrumb. */
  branchPath: readonly string[];
  shortDescription: string;
  /** Notable proponents, e.g. "Zeno, Epictetus, Marcus Aurelius". */
  keyThinkers?: string;
  /** When it took shape, e.g. "3rd c. BCE", "20th century". */
  era?: string;
  /** Where it arose, e.g. "Ancient Greece". */
  region?: string;
  profile: Profile;
};

export type Contribution = {
  dimension: DimensionKey;
  option: string;
  weight: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  contributions: readonly Contribution[];
};

/**
 * A visibility condition for a follow-up question: passes when the referenced
 * (earlier) question has at least one chosen option in `anyOf`.
 */
export type Condition = {
  questionId: string;
  anyOf: readonly string[];
};

export type Question = {
  id: string;
  section: string;
  prompt: string;
  helpText?: string;
  multiSelect: boolean;
  /**
   * Decision-tree gate: show this question only when EVERY condition passes.
   * Omitted/empty = always shown (a gateway question).
   */
  showIf?: readonly Condition[];
  options: readonly QuestionOption[];
};

/** question id -> chosen option ids. Absent/empty = skipped (contributes nothing). */
export type Answers = Record<string, string[]>;

/** Aggregated, normalized user preference: dimension -> option -> weight in [0,1]. */
export type UserVector = Partial<Record<DimensionKey, Record<string, number>>>;

export type DimensionContribution = {
  dimension: DimensionKey;
  overlap: number;
  schoolTopOption: string;
};

export type RankedSchool = {
  school: School;
  matchPct: number;
  strengths: DimensionContribution[];
  biggestGap?: DimensionContribution;
};
