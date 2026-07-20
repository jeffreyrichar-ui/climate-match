/**
 * The axes that both the questionnaire and every philosophical school speak.
 * These are philosophy-native (metaphysics, epistemology, ethics, the good life,
 * free will, meaning, death, temperament…) — deliberately NOT the theistic axes
 * of a religion quiz, which would collapse to one value for non-theistic thought.
 *
 * Single source of truth for valid dimension/option keys — the data-integrity
 * test asserts nothing references a key not defined here.
 */

export type DimensionKey =
  | 'metaphysics'
  | 'epistemology'
  | 'ethicsBasis'
  | 'theGoodLife'
  | 'freeWill'
  | 'meaningSource'
  | 'selfSociety'
  | 'moralScope'
  | 'viewOfDeath'
  | 'desireStance'
  | 'emotionReason'
  | 'humanNature'
  | 'changeOrientation'
  | 'worldStance'
  | 'metaphilosophy'
  | 'attitudeToScience';

export type DimensionOption = { key: string; label: string };

export type Dimension = {
  key: DimensionKey;
  label: string;
  /** A short gloss shown in "why it fits" chips. */
  prompt: string;
  options: readonly DimensionOption[];
};

export const DIMENSIONS: readonly Dimension[] = [
  {
    key: 'metaphysics',
    label: 'Nature of Reality',
    prompt: 'What reality is ultimately made of',
    options: [
      { key: 'materialism', label: 'Matter/physical stuff is all there is' },
      { key: 'idealism', label: 'Mind or consciousness is fundamental' },
      { key: 'dualism', label: 'Mind and matter are both real and distinct' },
      { key: 'monism', label: 'All is ultimately one substance' },
      { key: 'process', label: 'Reality is flux, change, and becoming' },
      { key: 'pluralism', label: 'Reality is irreducibly many kinds of things' },
      { key: 'skeptical', label: 'Reality’s ultimate nature is unknowable' },
    ],
  },
  {
    key: 'epistemology',
    label: 'How We Know',
    prompt: 'Where genuine knowledge comes from',
    options: [
      { key: 'empiricism', label: 'The senses and evidence' },
      { key: 'rationalism', label: 'Reason and logic' },
      { key: 'skepticism', label: 'Certain knowledge is not possible' },
      { key: 'intuition-experience', label: 'Direct, lived experience' },
      { key: 'pragmatism', label: 'Whatever works in practice' },
    ],
  },
  {
    key: 'ethicsBasis',
    label: 'Basis of Right & Wrong',
    prompt: 'What ultimately makes an act right',
    options: [
      { key: 'virtue', label: 'Good character and virtue' },
      { key: 'consequences', label: 'The outcomes and overall wellbeing' },
      { key: 'duty', label: 'Duty and universal principles' },
      { key: 'egoism', label: 'Rational self-interest' },
      { key: 'care-compassion', label: 'Care, empathy, and compassion' },
      { key: 'social-contract', label: 'Mutual agreement and fairness' },
      { key: 'relativism', label: 'Relative to culture or person' },
      { key: 'natural-law', label: 'A built-in natural moral order' },
    ],
  },
  {
    key: 'theGoodLife',
    label: 'The Highest Good',
    prompt: 'What a good life ultimately aims at',
    options: [
      { key: 'pleasure', label: 'Pleasure and enjoyment' },
      { key: 'tranquility', label: 'Peace of mind, freedom from disturbance' },
      { key: 'virtue-excellence', label: 'Virtue and flourishing (eudaimonia)' },
      { key: 'duty-honor', label: 'Duty, honor, and integrity' },
      { key: 'self-actualization', label: 'Becoming your fullest self' },
      { key: 'liberation', label: 'Freedom from suffering or illusion' },
      { key: 'meaning-creation', label: 'Meaning you forge yourself' },
      { key: 'knowledge', label: 'Understanding and truth' },
    ],
  },
  {
    key: 'freeWill',
    label: 'Free Will',
    prompt: 'Whether our choices are truly free',
    options: [
      { key: 'libertarian-free', label: 'We have genuine free will' },
      { key: 'determinism', label: 'Everything is causally determined' },
      { key: 'compatibilism', label: 'Freedom and determinism both hold' },
      { key: 'not-central', label: 'Not a central concern' },
    ],
  },
  {
    key: 'meaningSource',
    label: 'Source of Meaning',
    prompt: 'Where life’s meaning comes from',
    options: [
      { key: 'cosmic-order', label: 'A cosmic order to align with' },
      { key: 'self-created', label: 'Meaning we create for ourselves' },
      { key: 'relationships', label: 'Love, relationships, and community' },
      { key: 'progress', label: 'Improving the world and the future' },
      { key: 'none-and-ok', label: 'No inherent meaning — and that’s fine' },
    ],
  },
  {
    key: 'selfSociety',
    label: 'Self & Society',
    prompt: 'How the individual relates to the group',
    options: [
      { key: 'individualist', label: 'The individual comes first' },
      { key: 'communitarian', label: 'The community comes first' },
      { key: 'cosmopolitan', label: 'All humanity as one community' },
      { key: 'relational', label: 'We exist only through our relationships' },
    ],
  },
  {
    key: 'moralScope',
    label: 'Who Counts Morally',
    prompt: 'How wide your circle of moral concern is',
    options: [
      { key: 'self', label: 'Chiefly oneself' },
      { key: 'community', label: 'One’s own community' },
      { key: 'all-humans', label: 'All human beings' },
      { key: 'all-sentient', label: 'All beings that can suffer' },
      { key: 'all-nature', label: 'All of nature and the cosmos' },
    ],
  },
  {
    key: 'viewOfDeath',
    label: 'On Death',
    prompt: 'How to face mortality',
    options: [
      { key: 'acceptance', label: 'Accept it calmly as natural' },
      { key: 'transcend-detach', label: 'Detach from and transcend it' },
      { key: 'memento-mori', label: 'Let it sharpen how you live now' },
      { key: 'irrelevant', label: 'Nothing to fear; not a focus' },
      { key: 'continuation', label: 'Some continuation (rebirth, soul-stuff)' },
    ],
  },
  {
    key: 'desireStance',
    label: 'Desire & Emotion',
    prompt: 'The ideal relationship to desire',
    options: [
      { key: 'transcend', label: 'Extinguish craving and transcend desire' },
      { key: 'master', label: 'Master and discipline the passions' },
      { key: 'moderate', label: 'Enjoy desire in balanced moderation' },
      { key: 'embrace', label: 'Fully embrace desire and feeling' },
    ],
  },
  {
    key: 'emotionReason',
    label: 'Head vs Heart',
    prompt: 'The roles of reason and emotion',
    options: [
      { key: 'reason-primary', label: 'Reason should rule' },
      { key: 'emotion-valued', label: 'Emotion carries real wisdom' },
      { key: 'balance', label: 'A balance of both' },
      { key: 'beyond-both', label: 'Suspend or move beyond both' },
    ],
  },
  {
    key: 'humanNature',
    label: 'Human Nature',
    prompt: 'What people are fundamentally like',
    options: [
      { key: 'perfectible', label: 'Basically good and improvable' },
      { key: 'fixed-flawed', label: 'Flawed and largely fixed' },
      { key: 'blank-slate', label: 'Shaped by environment and habit' },
      { key: 'social', label: 'Fundamentally social' },
      { key: 'self-interested', label: 'Fundamentally self-interested' },
    ],
  },
  {
    key: 'changeOrientation',
    label: 'Tradition vs Progress',
    prompt: 'Stance toward change and the past',
    options: [
      { key: 'restore-classical', label: 'Recover ancient wisdom' },
      { key: 'conserve', label: 'Preserve what already works' },
      { key: 'reform-progress', label: 'Steady reform and progress' },
      { key: 'radical-transform', label: 'Radical transformation' },
    ],
  },
  {
    key: 'worldStance',
    label: 'The Material World',
    prompt: 'Attitude to worldly life and the body',
    options: [
      { key: 'affirming', label: 'Embrace worldly life' },
      { key: 'balanced', label: 'A measured middle way' },
      { key: 'ascetic', label: 'Discipline or renounce it' },
    ],
  },
  {
    key: 'metaphilosophy',
    label: 'What Philosophy Is For',
    prompt: 'What philosophy is ultimately for',
    options: [
      { key: 'way-of-life', label: 'A way of life to practice' },
      { key: 'system-theory', label: 'A systematic theory of everything' },
      { key: 'skeptical-inquiry', label: 'Endless questioning and inquiry' },
      { key: 'political-praxis', label: 'Changing society' },
      { key: 'therapeutic', label: 'Curing anxiety and confusion' },
    ],
  },
  {
    key: 'attitudeToScience',
    label: 'Role of Science',
    prompt: 'How much to defer to science',
    options: [
      { key: 'science-guide', label: 'Our best guide to truth' },
      { key: 'science-limited', label: 'Useful but limited' },
      { key: 'science-critical', label: 'Its authority should be questioned' },
      { key: 'neutral', label: 'Not a central concern' },
    ],
  },
] as const;

export const DIMENSION_BY_KEY: Record<DimensionKey, Dimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d]),
) as Record<DimensionKey, Dimension>;

/** Valid option keys per dimension, for runtime validation and tests. */
export const OPTION_KEYS: Record<DimensionKey, ReadonlySet<string>> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, new Set(d.options.map((o) => o.key))]),
) as unknown as Record<DimensionKey, ReadonlySet<string>>;

export function optionLabel(dimension: DimensionKey, optionKey: string): string {
  const dim = DIMENSION_BY_KEY[dimension];
  return dim?.options.find((o) => o.key === optionKey)?.label ?? optionKey;
}

export function isValidOption(dimension: string, optionKey: string): boolean {
  const set = OPTION_KEYS[dimension as DimensionKey];
  return set ? set.has(optionKey) : false;
}
