/**
 * The axes that both the questionnaire and every philosophical school speak.
 * Keys (dimension + option) are FROZEN — schools.ts profiles reference them —
 * but labels are written in plain, everyday words for the results screen.
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
  /** A short gloss for tooling/docs. */
  prompt: string;
  options: readonly DimensionOption[];
};

export const DIMENSIONS: readonly Dimension[] = [
  {
    key: 'metaphysics',
    label: 'What’s real',
    prompt: 'What reality is made of',
    options: [
      { key: 'materialism', label: 'It’s all physical stuff' },
      { key: 'idealism', label: 'Mind comes first' },
      { key: 'dualism', label: 'Both mind and matter' },
      { key: 'monism', label: 'Everything is one' },
      { key: 'process', label: 'Everything is change' },
      { key: 'pluralism', label: 'Many different things' },
      { key: 'skeptical', label: 'No one can know' },
    ],
  },
  {
    key: 'epistemology',
    label: 'How we know things',
    prompt: 'Where knowledge comes from',
    options: [
      { key: 'empiricism', label: 'Evidence and the senses' },
      { key: 'rationalism', label: 'Reason and logic' },
      { key: 'skepticism', label: 'Nothing is certain' },
      { key: 'intuition-experience', label: 'Lived experience' },
      { key: 'pragmatism', label: 'What works' },
    ],
  },
  {
    key: 'ethicsBasis',
    label: 'What makes things right',
    prompt: 'The basis of right and wrong',
    options: [
      { key: 'virtue', label: 'Being a good person' },
      { key: 'consequences', label: 'Best results for everyone' },
      { key: 'duty', label: 'Rules and duty' },
      { key: 'egoism', label: 'Looking after yourself' },
      { key: 'care-compassion', label: 'Care and kindness' },
      { key: 'social-contract', label: 'A fair deal for all' },
      { key: 'relativism', label: 'Depends on culture' },
      { key: 'natural-law', label: 'Nature’s own order' },
    ],
  },
  {
    key: 'theGoodLife',
    label: 'The good life',
    prompt: 'What a good life aims at',
    options: [
      { key: 'pleasure', label: 'Enjoying life' },
      { key: 'tranquility', label: 'Peace of mind' },
      { key: 'virtue-excellence', label: 'Living with virtue' },
      { key: 'duty-honor', label: 'Duty and honor' },
      { key: 'self-actualization', label: 'Growing into yourself' },
      { key: 'liberation', label: 'Freedom from suffering' },
      { key: 'meaning-creation', label: 'Meaning you make' },
      { key: 'knowledge', label: 'Understanding and truth' },
    ],
  },
  {
    key: 'freeWill',
    label: 'Free will',
    prompt: 'Whether our choices are free',
    options: [
      { key: 'libertarian-free', label: 'We really choose' },
      { key: 'determinism', label: 'It’s all cause and effect' },
      { key: 'compatibilism', label: 'Both, somehow' },
      { key: 'not-central', label: 'Not a big worry' },
    ],
  },
  {
    key: 'meaningSource',
    label: 'Where meaning comes from',
    prompt: 'The source of life’s meaning',
    options: [
      { key: 'cosmic-order', label: 'Nature’s pattern' },
      { key: 'self-created', label: 'We make it ourselves' },
      { key: 'relationships', label: 'The people we love' },
      { key: 'progress', label: 'Making things better' },
      { key: 'none-and-ok', label: 'No built-in meaning — that’s fine' },
    ],
  },
  {
    key: 'selfSociety',
    label: 'You and others',
    prompt: 'How the individual relates to the group',
    options: [
      { key: 'individualist', label: 'The individual first' },
      { key: 'communitarian', label: 'The community first' },
      { key: 'cosmopolitan', label: 'All of humanity' },
      { key: 'relational', label: 'Our bonds make us' },
    ],
  },
  {
    key: 'moralScope',
    label: 'Who counts',
    prompt: 'How wide the circle of concern is',
    options: [
      { key: 'self', label: 'Yourself' },
      { key: 'community', label: 'Your community' },
      { key: 'all-humans', label: 'All people' },
      { key: 'all-sentient', label: 'All feeling beings' },
      { key: 'all-nature', label: 'All of nature' },
    ],
  },
  {
    key: 'viewOfDeath',
    label: 'Facing death',
    prompt: 'How to face mortality',
    options: [
      { key: 'acceptance', label: 'Meet it calmly' },
      { key: 'transcend-detach', label: 'Rise above it' },
      { key: 'memento-mori', label: 'Let it sharpen life' },
      { key: 'irrelevant', label: 'Nothing to fear' },
      { key: 'continuation', label: 'Something goes on' },
    ],
  },
  {
    key: 'desireStance',
    label: 'Handling desire',
    prompt: 'The ideal relationship to desire',
    options: [
      { key: 'transcend', label: 'Let cravings go' },
      { key: 'master', label: 'Keep desire in check' },
      { key: 'moderate', label: 'Enjoy in moderation' },
      { key: 'embrace', label: 'Embrace it fully' },
    ],
  },
  {
    key: 'emotionReason',
    label: 'Head vs heart',
    prompt: 'The roles of reason and emotion',
    options: [
      { key: 'reason-primary', label: 'Head leads' },
      { key: 'emotion-valued', label: 'Heart knows things' },
      { key: 'balance', label: 'Both together' },
      { key: 'beyond-both', label: 'Quiet both, see clearly' },
    ],
  },
  {
    key: 'humanNature',
    label: 'Human nature',
    prompt: 'What people are like',
    options: [
      { key: 'perfectible', label: 'Good and improvable' },
      { key: 'fixed-flawed', label: 'Flawed as we are' },
      { key: 'blank-slate', label: 'Shaped by life' },
      { key: 'social', label: 'Built for groups' },
      { key: 'self-interested', label: 'Out for ourselves' },
    ],
  },
  {
    key: 'changeOrientation',
    label: 'Old ways vs new',
    prompt: 'Stance toward change and the past',
    options: [
      { key: 'restore-classical', label: 'Bring back old wisdom' },
      { key: 'conserve', label: 'Keep what works' },
      { key: 'reform-progress', label: 'Improve step by step' },
      { key: 'radical-transform', label: 'Change things deeply' },
    ],
  },
  {
    key: 'worldStance',
    label: 'Worldly things',
    prompt: 'Attitude to worldly life',
    options: [
      { key: 'affirming', label: 'Enjoy the world' },
      { key: 'balanced', label: 'A middle way' },
      { key: 'ascetic', label: 'Keep it simple' },
    ],
  },
  {
    key: 'metaphilosophy',
    label: 'What ideas are for',
    prompt: 'What philosophy is for',
    options: [
      { key: 'way-of-life', label: 'A way to live' },
      { key: 'system-theory', label: 'A map of everything' },
      { key: 'skeptical-inquiry', label: 'Endless questioning' },
      { key: 'political-praxis', label: 'Changing society' },
      { key: 'therapeutic', label: 'Calming the mind' },
    ],
  },
  {
    key: 'attitudeToScience',
    label: 'Trust in science',
    prompt: 'How much to defer to science',
    options: [
      { key: 'science-guide', label: 'Our best guide' },
      { key: 'science-limited', label: 'Useful but limited' },
      { key: 'science-critical', label: 'To be questioned' },
      { key: 'neutral', label: 'Not a big focus' },
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
