/**
 * The belief "axes" that both the questionnaire and every religion profile
 * speak. Each dimension is a categorical set of positions (options). A user's
 * answers accumulate weight onto (dimension, option) pairs; every religion in
 * the catalog carries a profile vector over these same pairs. Scoring is just
 * the overlap between the two (see scoring.ts).
 *
 * This file is the single source of truth for valid dimension/option keys — the
 * data-integrity test in scoring.test.ts asserts that nothing references a key
 * that is not defined here.
 */

export type DimensionKey =
  | 'theism'
  | 'divineNature'
  | 'authority'
  | 'scriptureReading'
  | 'afterlife'
  | 'salvationPath'
  | 'worldStance'
  | 'ritualIntensity'
  | 'mysticism'
  | 'community'
  | 'scope'
  | 'truthClaim'
  | 'keyFigures'
  | 'reformStance'
  | 'genderRoles'
  | 'lawInDailyLife'
  | 'era'
  | 'proselytizing'
  | 'cosmology'
  | 'moralSource'
  | 'ethicalFocus'
  | 'meaningSource'
  | 'desireStance';

export type DimensionOption = { key: string; label: string };

export type Dimension = {
  key: DimensionKey;
  label: string;
  /** A short gloss shown in "why this matched" chips and dev tooling. */
  prompt: string;
  options: readonly DimensionOption[];
};

export const DIMENSIONS: readonly Dimension[] = [
  {
    key: 'theism',
    label: 'The Divine',
    prompt: 'What kind, and how many, divine powers exist',
    options: [
      { key: 'monotheism', label: 'One God' },
      { key: 'polytheism', label: 'Many gods' },
      { key: 'nontheism', label: 'No gods (a path without deities)' },
      { key: 'pantheism', label: 'The universe itself is divine' },
      { key: 'panentheism', label: 'The divine is in and beyond all things' },
      { key: 'dualism', label: 'Two opposing cosmic powers' },
      { key: 'animism', label: 'Spirits fill nature and objects' },
      { key: 'henotheism', label: 'One god worshipped among many' },
      { key: 'deism', label: 'A distant creator who does not intervene' },
      { key: 'agnostic', label: 'The divine is unknown or unknowable' },
    ],
  },
  {
    key: 'divineNature',
    label: 'Nature of the Divine',
    prompt: 'Whether ultimate reality is a person or an impersonal force',
    options: [
      { key: 'personal', label: 'A personal being you can relate to' },
      { key: 'impersonal', label: 'An impersonal force, law, or ground of being' },
      { key: 'both', label: 'Both personal and impersonal aspects' },
      { key: 'none', label: 'No divine being at all' },
    ],
  },
  {
    key: 'authority',
    label: 'Source of Authority',
    prompt: 'Where religious truth ultimately comes from',
    options: [
      { key: 'scripture', label: 'Sacred scripture' },
      { key: 'clergy', label: 'Clergy, hierarchy, or institution' },
      { key: 'personal-experience', label: 'Direct personal experience' },
      { key: 'reason', label: 'Reason and philosophy' },
      { key: 'tradition', label: 'Inherited tradition and custom' },
      { key: 'living-teacher', label: 'A living teacher, guru, or master' },
      { key: 'nature', label: 'Nature and the cosmos itself' },
    ],
  },
  {
    key: 'scriptureReading',
    label: 'Reading of Texts',
    prompt: 'How sacred texts are interpreted',
    options: [
      { key: 'literal', label: 'Literally and inerrantly' },
      { key: 'contextual', label: 'In historical and moral context' },
      { key: 'allegorical', label: 'Symbolically and mystically' },
      { key: 'non-scriptural', label: 'Little or no reliance on texts' },
    ],
  },
  {
    key: 'afterlife',
    label: 'After Death',
    prompt: 'What is believed to happen after death',
    options: [
      { key: 'heaven-hell', label: 'Heaven or hell / judgment' },
      { key: 'reincarnation', label: 'Rebirth into another life' },
      { key: 'liberation', label: 'Release from the cycle of rebirth' },
      { key: 'union-divine', label: 'Union or merger with the divine' },
      { key: 'ancestral', label: 'Joining the ancestors / spirit world' },
      { key: 'none', label: 'Nothing — death is the end' },
      { key: 'uncertain', label: 'Unknown, and not the focus' },
    ],
  },
  {
    key: 'salvationPath',
    label: 'Path to Salvation',
    prompt: 'How one is saved, liberated, or made whole',
    options: [
      { key: 'faith-grace', label: 'Faith and divine grace' },
      { key: 'good-works', label: 'Good deeds and ethical living' },
      { key: 'ritual', label: 'Ritual observance and sacraments' },
      { key: 'knowledge', label: 'Sacred knowledge or gnosis' },
      { key: 'meditation', label: 'Meditation and inner discipline' },
      { key: 'devotion', label: 'Loving devotion to the divine' },
      { key: 'self-cultivation', label: 'Cultivating virtue and harmony' },
      { key: 'not-central', label: 'Salvation is not a central concern' },
    ],
  },
  {
    key: 'worldStance',
    label: 'The Material World',
    prompt: 'Attitude toward the body, pleasure, and worldly life',
    options: [
      { key: 'affirming', label: 'Embrace the world and its pleasures' },
      { key: 'balanced', label: 'A middle way between indulgence and denial' },
      { key: 'ascetic', label: 'Renounce or discipline worldly desire' },
    ],
  },
  {
    key: 'ritualIntensity',
    label: 'Ritual & Ceremony',
    prompt: 'How central formal ritual and liturgy are',
    options: [
      { key: 'high', label: 'Rich, frequent ritual and liturgy' },
      { key: 'moderate', label: 'Some regular ritual' },
      { key: 'low', label: 'Simple, minimal ritual' },
      { key: 'none', label: 'Little or no formal ritual' },
    ],
  },
  {
    key: 'mysticism',
    label: 'Mysticism',
    prompt: 'Emphasis on direct, mystical experience of the sacred',
    options: [
      { key: 'central', label: 'Mystical union is the heart of it' },
      { key: 'present', label: 'A valued but not central strand' },
      { key: 'minimal', label: 'Little emphasis on mysticism' },
    ],
  },
  {
    key: 'community',
    label: 'Community Structure',
    prompt: 'How the religious community is organized',
    options: [
      { key: 'hierarchical', label: 'A formal hierarchy and clergy' },
      { key: 'congregational', label: 'Self-governing local congregations' },
      { key: 'decentralized', label: 'Loose, decentralized, or individual' },
      { key: 'monastic', label: 'Centered on monastic orders' },
      { key: 'solitary', label: 'Practiced largely alone' },
    ],
  },
  {
    key: 'scope',
    label: 'Who It Is For',
    prompt: 'Whether the path is open to all or tied to a people',
    options: [
      { key: 'universal', label: 'Open to all of humanity' },
      { key: 'ethnic', label: 'Tied to a particular people or culture' },
      { key: 'initiatory', label: 'Entered through initiation' },
    ],
  },
  {
    key: 'truthClaim',
    label: 'Claim to Truth',
    prompt: 'Whether there is one true path or many',
    options: [
      { key: 'exclusive', label: 'One true path; others are mistaken' },
      { key: 'inclusive', label: 'One fullest path, but truth in others' },
      { key: 'pluralist', label: 'Many valid paths to the same summit' },
    ],
  },
  {
    key: 'keyFigures',
    label: 'Central Figures',
    prompt: 'The sacred figures at the center of devotion',
    options: [
      { key: 'jesus', label: 'Jesus Christ' },
      { key: 'muhammad', label: 'The Prophet Muhammad' },
      { key: 'hebrew-prophets', label: 'Moses and the Hebrew prophets' },
      { key: 'buddha', label: 'The Buddha' },
      { key: 'hindu-deities', label: 'Hindu deities (Vishnu, Shiva, Devi…)' },
      { key: 'guru-nanak', label: 'Guru Nanak and the Sikh Gurus' },
      { key: 'mahavira', label: 'Mahavira and the Tirthankaras' },
      { key: 'sages', label: 'Sages like Laozi or Confucius' },
      { key: 'zoroaster', label: 'Zarathustra (Zoroaster)' },
      { key: 'bahaullah', label: 'Baháʼu’lláh or the Báb' },
      { key: 'spirits', label: 'Orishas, loa, kami, or nature spirits' },
      { key: 'ancestors', label: 'Ancestors and the departed' },
      { key: 'goddess', label: 'The Goddess or a divine feminine' },
      { key: 'living-guru', label: 'A living guru or founder' },
      { key: 'none', label: 'No single central figure' },
      { key: 'self', label: 'The awakened self' },
    ],
  },
  {
    key: 'reformStance',
    label: 'Tradition vs. Reform',
    prompt: 'Openness to modern reform of belief and practice',
    options: [
      { key: 'traditionalist', label: 'Preserve inherited tradition closely' },
      { key: 'moderate', label: 'Balance tradition with change' },
      { key: 'progressive', label: 'Reform and reinterpret for today' },
    ],
  },
  {
    key: 'genderRoles',
    label: 'Gender & Roles',
    prompt: 'How gender shapes religious life and leadership',
    options: [
      { key: 'egalitarian', label: 'Equal roles regardless of gender' },
      { key: 'complementarian', label: 'Distinct but honored roles' },
      { key: 'traditional', label: 'Traditional, gendered roles' },
    ],
  },
  {
    key: 'lawInDailyLife',
    label: 'Rules for Living',
    prompt: 'How far religious law governs everyday life',
    options: [
      { key: 'comprehensive', label: 'A detailed code for daily life' },
      { key: 'moderate', label: 'Some guidelines, broadly applied' },
      { key: 'minimal', label: 'Few fixed rules; conscience leads' },
    ],
  },
  {
    key: 'era',
    label: 'Age of the Tradition',
    prompt: 'When the tradition took shape',
    options: [
      { key: 'ancient', label: 'Ancient / prehistoric roots' },
      { key: 'classical', label: 'The classical age of world religions' },
      { key: 'medieval', label: 'Medieval developments' },
      { key: 'modern', label: 'Modern or new religious movement' },
    ],
  },
  {
    key: 'proselytizing',
    label: 'Sharing the Faith',
    prompt: 'Whether the tradition seeks converts',
    options: [
      { key: 'active', label: 'Actively seeks converts' },
      { key: 'welcoming', label: 'Welcomes but does not pursue converts' },
      { key: 'non-proselytizing', label: 'Does not seek converts' },
      { key: 'closed', label: 'Closed — born or initiated into' },
    ],
  },
  {
    key: 'cosmology',
    label: 'Shape of Reality',
    prompt: 'The overall picture of time and the cosmos',
    options: [
      { key: 'linear', label: 'A created world moving toward an end' },
      { key: 'cyclical', label: 'Endless cycles of ages and rebirth' },
      { key: 'monistic', label: 'All reality is ultimately one' },
      { key: 'naturalistic', label: 'A natural cosmos, no supernatural' },
      { key: 'animate', label: 'A living cosmos full of spirit' },
    ],
  },
  {
    key: 'moralSource',
    label: 'Basis of Ethics',
    prompt: 'Where moral duty ultimately comes from',
    options: [
      { key: 'divine-command', label: 'Commands of God' },
      { key: 'karma', label: 'The law of karma and consequence' },
      { key: 'natural-law', label: 'A built-in moral order' },
      { key: 'harmony', label: 'Harmony and balance with the world' },
      { key: 'reason', label: 'Human reason and empathy' },
      { key: 'compassion', label: 'Compassion for all beings' },
    ],
  },
  {
    key: 'ethicalFocus',
    label: 'Focus of Moral Life',
    prompt: 'Where your moral energy is chiefly directed',
    options: [
      { key: 'self-mastery', label: 'Mastering and perfecting yourself' },
      { key: 'family-community', label: 'Duty to family and community' },
      { key: 'social-justice', label: 'Justice for the vulnerable and society' },
      { key: 'all-beings', label: 'The welfare of all living beings' },
      { key: 'devotion-divine', label: 'Devotion and service to the divine' },
    ],
  },
  {
    key: 'meaningSource',
    label: 'Source of Meaning',
    prompt: 'Where life’s meaning ultimately comes from',
    options: [
      { key: 'divine-plan', label: 'A divine plan or God’s will' },
      { key: 'cosmic-order', label: 'A cosmic order to align with (dharma, the Tao)' },
      { key: 'self-created', label: 'Meaning we each create for ourselves' },
      { key: 'relationships', label: 'Love, relationships, and community' },
      { key: 'none-and-ok', label: 'There is no inherent meaning — and that’s okay' },
    ],
  },
  {
    key: 'desireStance',
    label: 'Desire & Emotion',
    prompt: 'The ideal relationship to desire and emotion',
    options: [
      { key: 'transcend', label: 'Extinguish craving and transcend desire' },
      { key: 'master', label: 'Master and discipline the passions' },
      { key: 'moderate', label: 'Enjoy desire in balanced moderation' },
      { key: 'embrace', label: 'Fully embrace desire and feeling' },
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
