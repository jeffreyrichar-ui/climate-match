import type { Question } from './types';

/**
 * The questionnaire, shaped as a decision tree: questions without `showIf` are
 * gateways everyone sees; questions with `showIf` are follow-ups that appear
 * only when an earlier answer opens them (see flow.ts). Wording aims for plain,
 * everyday language — no philosophy jargon on screen.
 *
 * Skipping a question contributes nothing, so it never counts against a school.
 */

export const SECTIONS = [
  'The Big Picture',
  'A Good Life',
  'Right & Wrong',
  'Freedom & Meaning',
  'You & the World',
] as const;

export const QUESTIONS: readonly Question[] = [
  // ───────────────────────── The Big Picture ─────────────────────────
  {
    id: 'q_stuff',
    section: 'The Big Picture',
    prompt: 'Deep down, what is everything made of?',
    multiSelect: false,
    options: [
      { id: 'physical', label: 'Just physical stuff — atoms and energy', contributions: [{ dimension: 'metaphysics', option: 'materialism', weight: 2 }, { dimension: 'attitudeToScience', option: 'science-guide', weight: 0.4 }] },
      { id: 'mind', label: 'Mind — thoughts and awareness come first', contributions: [{ dimension: 'metaphysics', option: 'idealism', weight: 2 }] },
      { id: 'both', label: 'Two things: body-stuff and mind-stuff', contributions: [{ dimension: 'metaphysics', option: 'dualism', weight: 2 }] },
      { id: 'one', label: 'One big connected whole', contributions: [{ dimension: 'metaphysics', option: 'monism', weight: 2 }] },
      { id: 'changing', label: 'Change itself — nothing ever stays still', contributions: [{ dimension: 'metaphysics', option: 'process', weight: 2 }] },
      { id: 'many', label: 'Lots of different kinds of things', contributions: [{ dimension: 'metaphysics', option: 'pluralism', weight: 2 }] },
      { id: 'cant-know', label: 'Honestly? No one can know', contributions: [{ dimension: 'metaphysics', option: 'skeptical', weight: 2 }] },
    ],
  },
  {
    id: 'q_science',
    section: 'The Big Picture',
    prompt: 'How far can science take us?',
    showIf: [{ questionId: 'q_stuff', anyOf: ['physical', 'changing', 'many'] }],
    multiSelect: false,
    options: [
      { id: 'all-the-way', label: 'All the way — it’s our best tool for truth', contributions: [{ dimension: 'attitudeToScience', option: 'science-guide', weight: 2 }, { dimension: 'epistemology', option: 'empiricism', weight: 0.6 }] },
      { id: 'far-not-all', label: 'Far, but some things it can’t answer', contributions: [{ dimension: 'attitudeToScience', option: 'science-limited', weight: 2 }] },
      { id: 'careful', label: 'We should question it like anything else', contributions: [{ dimension: 'attitudeToScience', option: 'science-critical', weight: 2 }, { dimension: 'epistemology', option: 'skepticism', weight: 0.4 }] },
    ],
  },
  {
    id: 'q_ideas_real',
    section: 'The Big Picture',
    prompt: 'Do perfect ideas — like numbers, or "the good" — exist on their own, outside our heads?',
    showIf: [{ questionId: 'q_stuff', anyOf: ['mind', 'one', 'both'] }],
    multiSelect: false,
    options: [
      { id: 'yes', label: 'Yes — they’re real, and more lasting than things', contributions: [{ dimension: 'metaphysics', option: 'idealism', weight: 1.5 }, { dimension: 'epistemology', option: 'rationalism', weight: 0.8 }] },
      { id: 'part-of-whole', label: 'They’re part of the one whole, like everything', contributions: [{ dimension: 'metaphysics', option: 'monism', weight: 1.5 }] },
      { id: 'in-minds', label: 'No — they only live in our minds', contributions: [{ dimension: 'epistemology', option: 'pragmatism', weight: 1 }, { dimension: 'metaphysics', option: 'materialism', weight: 0.5 }] },
    ],
  },
  {
    id: 'q_doubt',
    section: 'The Big Picture',
    prompt: 'If we can’t be sure of anything, what’s the smart move?',
    showIf: [{ questionId: 'q_stuff', anyOf: ['cant-know'] }],
    multiSelect: false,
    options: [
      { id: 'keep-asking', label: 'Keep questioning everything, forever', contributions: [{ dimension: 'epistemology', option: 'skepticism', weight: 1.5 }, { dimension: 'metaphilosophy', option: 'skeptical-inquiry', weight: 1 }] },
      { id: 'relax', label: 'Stop worrying — letting go of certainty brings peace', contributions: [{ dimension: 'epistemology', option: 'skepticism', weight: 1 }, { dimension: 'metaphilosophy', option: 'therapeutic', weight: 1 }, { dimension: 'theGoodLife', option: 'tranquility', weight: 0.5 }] },
      { id: 'live-anyway', label: 'Just live by what works day to day', contributions: [{ dimension: 'epistemology', option: 'pragmatism', weight: 1.5 }] },
    ],
  },
  {
    id: 'q_truth',
    section: 'The Big Picture',
    prompt: 'When you want to know if something is true, what do you trust most?',
    multiSelect: false,
    options: [
      { id: 'evidence', label: 'My eyes and the evidence', contributions: [{ dimension: 'epistemology', option: 'empiricism', weight: 2 }] },
      { id: 'thinking', label: 'Careful thinking and logic', contributions: [{ dimension: 'epistemology', option: 'rationalism', weight: 2 }] },
      { id: 'gut', label: 'Direct experience — what I’ve lived', contributions: [{ dimension: 'epistemology', option: 'intuition-experience', weight: 2 }] },
      { id: 'works', label: 'Whatever actually works', contributions: [{ dimension: 'epistemology', option: 'pragmatism', weight: 2 }] },
      { id: 'nothing-fully', label: 'Nothing fully — I stay doubtful', contributions: [{ dimension: 'epistemology', option: 'skepticism', weight: 2 }] },
    ],
  },
  {
    id: 'q_brain',
    section: 'The Big Picture',
    prompt: 'Is your mind just your brain at work?',
    showIf: [{ questionId: 'q_stuff', anyOf: ['physical'] }],
    multiSelect: false,
    options: [
      { id: 'yes', label: 'Yes — thoughts are brain activity, full stop', contributions: [{ dimension: 'metaphysics', option: 'materialism', weight: 1.5 }, { dimension: 'freeWill', option: 'determinism', weight: 0.5 }] },
      { id: 'somehow-more', label: 'Mostly, but feeling something is still a mystery', contributions: [{ dimension: 'metaphysics', option: 'materialism', weight: 0.8 }, { dimension: 'metaphysics', option: 'dualism', weight: 0.5 }] },
      { id: 'everything-feels', label: 'Maybe a little bit of mind is in everything', contributions: [{ dimension: 'metaphysics', option: 'monism', weight: 1 }, { dimension: 'metaphysics', option: 'idealism', weight: 0.5 }] },
    ],
  },

  // ─────────────────────────── A Good Life ───────────────────────────
  {
    id: 'q_good_life',
    section: 'A Good Life',
    prompt: 'What’s the point of a good life?',
    multiSelect: false,
    options: [
      { id: 'enjoy', label: 'Enjoying it — pleasure and good times', contributions: [{ dimension: 'theGoodLife', option: 'pleasure', weight: 2 }] },
      { id: 'peace', label: 'Peace of mind — staying calm and unshaken', contributions: [{ dimension: 'theGoodLife', option: 'tranquility', weight: 2 }] },
      { id: 'be-good', label: 'Being a truly good person', contributions: [{ dimension: 'theGoodLife', option: 'virtue-excellence', weight: 2 }] },
      { id: 'duty', label: 'Doing your duty and keeping your word', contributions: [{ dimension: 'theGoodLife', option: 'duty-honor', weight: 2 }] },
      { id: 'grow', label: 'Growing into the best version of yourself', contributions: [{ dimension: 'theGoodLife', option: 'self-actualization', weight: 2 }] },
      { id: 'get-free', label: 'Getting free of suffering', contributions: [{ dimension: 'theGoodLife', option: 'liberation', weight: 2 }] },
      { id: 'make-meaning', label: 'Making your own meaning', contributions: [{ dimension: 'theGoodLife', option: 'meaning-creation', weight: 2 }] },
      { id: 'understand', label: 'Understanding how the world works', contributions: [{ dimension: 'theGoodLife', option: 'knowledge', weight: 2 }] },
    ],
  },
  {
    id: 'q_enjoy_style',
    section: 'A Good Life',
    prompt: 'What kind of enjoyment sounds best?',
    showIf: [{ questionId: 'q_good_life', anyOf: ['enjoy', 'grow'] }],
    multiSelect: false,
    options: [
      { id: 'quiet', label: 'Quiet pleasures — good food, no drama', contributions: [{ dimension: 'theGoodLife', option: 'tranquility', weight: 1 }, { dimension: 'desireStance', option: 'moderate', weight: 1 }] },
      { id: 'intense', label: 'Big, rich, intense experiences', contributions: [{ dimension: 'desireStance', option: 'embrace', weight: 1.5 }, { dimension: 'worldStance', option: 'affirming', weight: 0.8 }] },
      { id: 'with-friends', label: 'Shared ones — good company most of all', contributions: [{ dimension: 'meaningSource', option: 'relationships', weight: 1 }, { dimension: 'desireStance', option: 'moderate', weight: 0.6 }] },
    ],
  },
  {
    id: 'q_discipline',
    section: 'A Good Life',
    prompt: 'How do you feel about strict self-discipline?',
    showIf: [{ questionId: 'q_good_life', anyOf: ['be-good', 'duty'] }],
    multiSelect: false,
    options: [
      { id: 'love-it', label: 'It’s the backbone of a good life', contributions: [{ dimension: 'desireStance', option: 'master', weight: 1.5 }, { dimension: 'worldStance', option: 'ascetic', weight: 0.8 }] },
      { id: 'some', label: 'Useful, in reasonable doses', contributions: [{ dimension: 'desireStance', option: 'master', weight: 0.8 }, { dimension: 'worldStance', option: 'balanced', weight: 0.8 }] },
      { id: 'kindness-first', label: 'Being kind matters more than being strict', contributions: [{ dimension: 'ethicsBasis', option: 'care-compassion', weight: 1 }, { dimension: 'emotionReason', option: 'emotion-valued', weight: 0.5 }] },
    ],
  },
  {
    id: 'q_letting_go',
    section: 'A Good Life',
    prompt: 'What’s the surest way to find peace?',
    showIf: [{ questionId: 'q_good_life', anyOf: ['get-free', 'peace'] }],
    multiSelect: false,
    options: [
      { id: 'want-less', label: 'Want less — let cravings go', contributions: [{ dimension: 'desireStance', option: 'transcend', weight: 1.5 }, { dimension: 'worldStance', option: 'ascetic', weight: 0.6 }] },
      { id: 'control-reactions', label: 'Control your reactions, not the world', contributions: [{ dimension: 'desireStance', option: 'master', weight: 1.5 }, { dimension: 'emotionReason', option: 'reason-primary', weight: 0.5 }] },
      { id: 'simple-joys', label: 'Keep life simple and savor small joys', contributions: [{ dimension: 'desireStance', option: 'moderate', weight: 1.2 }, { dimension: 'theGoodLife', option: 'tranquility', weight: 0.6 }] },
    ],
  },
  {
    id: 'q_wants',
    section: 'A Good Life',
    prompt: 'What should we do with our wants and cravings?',
    multiSelect: false,
    options: [
      { id: 'let-go', label: 'Let them go — they cause suffering', contributions: [{ dimension: 'desireStance', option: 'transcend', weight: 2 }] },
      { id: 'keep-in-check', label: 'Keep them firmly in check', contributions: [{ dimension: 'desireStance', option: 'master', weight: 2 }] },
      { id: 'enjoy-wisely', label: 'Enjoy them, in moderation', contributions: [{ dimension: 'desireStance', option: 'moderate', weight: 2 }] },
      { id: 'follow', label: 'Follow them — they’re part of being alive', contributions: [{ dimension: 'desireStance', option: 'embrace', weight: 2 }] },
    ],
  },
  {
    id: 'q_stuff_money',
    section: 'A Good Life',
    prompt: 'Money and nice things are…',
    multiSelect: false,
    options: [
      { id: 'great', label: 'Great — enjoy them', contributions: [{ dimension: 'worldStance', option: 'affirming', weight: 2 }] },
      { id: 'fine', label: 'Fine, as long as they don’t own you', contributions: [{ dimension: 'worldStance', option: 'balanced', weight: 2 }] },
      { id: 'trap', label: 'A trap — keep life simple', contributions: [{ dimension: 'worldStance', option: 'ascetic', weight: 2 }] },
    ],
  },
  {
    id: 'q_hard_times',
    section: 'A Good Life',
    prompt: 'When life gets hard, the best move is to…',
    multiSelect: false,
    options: [
      { id: 'stay-calm', label: 'Stay calm and accept what you can’t change', contributions: [{ dimension: 'desireStance', option: 'master', weight: 1 }, { dimension: 'viewOfDeath', option: 'acceptance', weight: 0.5 }, { dimension: 'theGoodLife', option: 'tranquility', weight: 0.5 }] },
      { id: 'find-meaning', label: 'Find some meaning in it', contributions: [{ dimension: 'meaningSource', option: 'self-created', weight: 1 }, { dimension: 'theGoodLife', option: 'meaning-creation', weight: 0.6 }] },
      { id: 'fix-it', label: 'Roll up your sleeves and fix what you can', contributions: [{ dimension: 'epistemology', option: 'pragmatism', weight: 1 }, { dimension: 'meaningSource', option: 'progress', weight: 0.6 }] },
      { id: 'lean-on-people', label: 'Lean on the people you love', contributions: [{ dimension: 'meaningSource', option: 'relationships', weight: 1 }, { dimension: 'selfSociety', option: 'relational', weight: 0.6 }] },
    ],
  },

  // ─────────────────────────── Right & Wrong ───────────────────────────
  {
    id: 'q_right',
    section: 'Right & Wrong',
    prompt: 'What makes something the right thing to do?',
    multiSelect: false,
    options: [
      { id: 'good-person', label: 'It’s what a good person would do', contributions: [{ dimension: 'ethicsBasis', option: 'virtue', weight: 2 }] },
      { id: 'best-results', label: 'It leads to the best results for everyone', contributions: [{ dimension: 'ethicsBasis', option: 'consequences', weight: 2 }] },
      { id: 'follow-rules', label: 'It follows rules that apply to everyone', contributions: [{ dimension: 'ethicsBasis', option: 'duty', weight: 2 }] },
      { id: 'good-for-me', label: 'It’s good for me and my life', contributions: [{ dimension: 'ethicsBasis', option: 'egoism', weight: 2 }] },
      { id: 'caring', label: 'It comes from caring about people', contributions: [{ dimension: 'ethicsBasis', option: 'care-compassion', weight: 2 }] },
      { id: 'fair-deal', label: 'It’s the fair deal we’d all agree to', contributions: [{ dimension: 'ethicsBasis', option: 'social-contract', weight: 2 }] },
      { id: 'depends', label: 'It depends on the culture and situation', contributions: [{ dimension: 'ethicsBasis', option: 'relativism', weight: 2 }] },
      { id: 'built-in', label: 'It fits how nature meant things to work', contributions: [{ dimension: 'ethicsBasis', option: 'natural-law', weight: 2 }] },
    ],
  },
  {
    id: 'q_who_counts',
    section: 'Right & Wrong',
    prompt: 'When you add up the good and bad, who counts?',
    showIf: [{ questionId: 'q_right', anyOf: ['best-results', 'caring'] }],
    multiSelect: false,
    options: [
      { id: 'my-people', label: 'The people in my life', contributions: [{ dimension: 'moralScope', option: 'community', weight: 1.5 }] },
      { id: 'all-people', label: 'Every person, everywhere', contributions: [{ dimension: 'moralScope', option: 'all-humans', weight: 1.5 }] },
      { id: 'all-feeling', label: 'Anything that can feel — animals too', contributions: [{ dimension: 'moralScope', option: 'all-sentient', weight: 1.5 }] },
      { id: 'whole-planet', label: 'The whole living planet', contributions: [{ dimension: 'moralScope', option: 'all-nature', weight: 1.5 }] },
    ],
  },
  {
    id: 'q_rules_hurt',
    section: 'Right & Wrong',
    prompt: 'Should you follow a rule even when it hurts?',
    showIf: [{ questionId: 'q_right', anyOf: ['follow-rules', 'built-in'] }],
    multiSelect: false,
    options: [
      { id: 'always', label: 'Yes — right is right, whatever it costs', contributions: [{ dimension: 'ethicsBasis', option: 'duty', weight: 1.5 }] },
      { id: 'mostly', label: 'Mostly, but results matter too', contributions: [{ dimension: 'ethicsBasis', option: 'duty', weight: 0.8 }, { dimension: 'ethicsBasis', option: 'consequences', weight: 0.6 }] },
      { id: 'rules-serve-us', label: 'No — rules are there to serve people', contributions: [{ dimension: 'ethicsBasis', option: 'consequences', weight: 1 }, { dimension: 'epistemology', option: 'pragmatism', weight: 0.5 }] },
    ],
  },
  {
    id: 'q_self_first',
    section: 'Right & Wrong',
    prompt: 'Looking out for yourself first is…',
    showIf: [{ questionId: 'q_right', anyOf: ['good-for-me', 'depends'] }],
    multiSelect: false,
    options: [
      { id: 'honest', label: 'Honest — everyone does, and that’s fine', contributions: [{ dimension: 'ethicsBasis', option: 'egoism', weight: 1.5 }, { dimension: 'humanNature', option: 'self-interested', weight: 0.8 }] },
      { id: 'natural-balance', label: 'Natural, but it needs balancing', contributions: [{ dimension: 'ethicsBasis', option: 'social-contract', weight: 0.8 }, { dimension: 'humanNature', option: 'self-interested', weight: 0.5 }] },
      { id: 'not-the-way', label: 'Not the way — caring for others comes first', contributions: [{ dimension: 'ethicsBasis', option: 'care-compassion', weight: 1 }] },
    ],
  },
  {
    id: 'q_owe',
    section: 'Right & Wrong',
    prompt: 'How much do we owe strangers on the far side of the world?',
    multiSelect: false,
    options: [
      { id: 'a-lot', label: 'A lot — distance doesn’t change what a life is worth', contributions: [{ dimension: 'moralScope', option: 'all-humans', weight: 1.2 }, { dimension: 'ethicsBasis', option: 'consequences', weight: 0.6 }] },
      { id: 'respect', label: 'Respect and fairness, always', contributions: [{ dimension: 'ethicsBasis', option: 'duty', weight: 1 }, { dimension: 'moralScope', option: 'all-humans', weight: 0.6 }] },
      { id: 'near-first', label: 'Care starts close to home', contributions: [{ dimension: 'ethicsBasis', option: 'care-compassion', weight: 0.8 }, { dimension: 'moralScope', option: 'community', weight: 1 }] },
      { id: 'self-reliance', label: 'Little — people should stand on their own', contributions: [{ dimension: 'ethicsBasis', option: 'egoism', weight: 1 }, { dimension: 'moralScope', option: 'self', weight: 0.8 }] },
    ],
  },
  {
    id: 'q_people',
    section: 'Right & Wrong',
    prompt: 'People are mostly…',
    multiSelect: false,
    options: [
      { id: 'good', label: 'Good at heart, and able to get better', contributions: [{ dimension: 'humanNature', option: 'perfectible', weight: 2 }] },
      { id: 'flawed', label: 'Flawed — and that doesn’t really change', contributions: [{ dimension: 'humanNature', option: 'fixed-flawed', weight: 2 }] },
      { id: 'shaped', label: 'Shaped by their upbringing and world', contributions: [{ dimension: 'humanNature', option: 'blank-slate', weight: 2 }] },
      { id: 'group-animals', label: 'Built for living in groups', contributions: [{ dimension: 'humanNature', option: 'social', weight: 2 }] },
      { id: 'self-serving', label: 'Out for themselves', contributions: [{ dimension: 'humanNature', option: 'self-interested', weight: 2 }] },
    ],
  },
  {
    id: 'q_me_vs_us',
    section: 'Right & Wrong',
    prompt: 'Which matters more?',
    multiSelect: false,
    options: [
      { id: 'my-freedom', label: 'My freedom to live my own way', contributions: [{ dimension: 'selfSociety', option: 'individualist', weight: 2 }] },
      { id: 'the-group', label: 'The health of the community', contributions: [{ dimension: 'selfSociety', option: 'communitarian', weight: 2 }] },
      { id: 'everyone', label: 'Everyone — the whole human family', contributions: [{ dimension: 'selfSociety', option: 'cosmopolitan', weight: 2 }] },
      { id: 'bonds', label: 'The bonds between people — that’s what we are', contributions: [{ dimension: 'selfSociety', option: 'relational', weight: 2 }] },
    ],
  },

  // ─────────────────────────── Freedom & Meaning ───────────────────────────
  {
    id: 'q_choice',
    section: 'Freedom & Meaning',
    prompt: 'Do we really choose, or does cause and effect run everything?',
    multiSelect: false,
    options: [
      { id: 'really-choose', label: 'We really choose — the future is open', contributions: [{ dimension: 'freeWill', option: 'libertarian-free', weight: 2 }] },
      { id: 'all-causes', label: 'It’s all cause and effect, even our choices', contributions: [{ dimension: 'freeWill', option: 'determinism', weight: 2 }] },
      { id: 'both-somehow', label: 'Both — my choices are caused, but still mine', contributions: [{ dimension: 'freeWill', option: 'compatibilism', weight: 2 }] },
      { id: 'no-worry', label: 'I don’t lose sleep over it', contributions: [{ dimension: 'freeWill', option: 'not-central', weight: 2 }] },
    ],
  },
  {
    id: 'q_fate_accept',
    section: 'Freedom & Meaning',
    prompt: 'If much of life is out of our hands, the wise move is to…',
    showIf: [{ questionId: 'q_choice', anyOf: ['all-causes', 'both-somehow'] }],
    multiSelect: false,
    options: [
      { id: 'embrace-it', label: 'Make peace with it — even welcome it', contributions: [{ dimension: 'viewOfDeath', option: 'acceptance', weight: 1 }, { dimension: 'desireStance', option: 'master', weight: 0.8 }] },
      { id: 'push-anyway', label: 'Push to improve things anyway', contributions: [{ dimension: 'meaningSource', option: 'progress', weight: 1 }, { dimension: 'changeOrientation', option: 'reform-progress', weight: 0.6 }] },
      { id: 'lighten-up', label: 'Lighten up — most worry is wasted', contributions: [{ dimension: 'theGoodLife', option: 'tranquility', weight: 1 }, { dimension: 'metaphilosophy', option: 'therapeutic', weight: 0.6 }] },
    ],
  },
  {
    id: 'q_make_meaning',
    section: 'Freedom & Meaning',
    prompt: 'If we’re truly free, what comes with that?',
    showIf: [{ questionId: 'q_choice', anyOf: ['really-choose'] }],
    multiSelect: false,
    options: [
      { id: 'invent-yourself', label: 'The job of inventing your own life', contributions: [{ dimension: 'meaningSource', option: 'self-created', weight: 1.2 }, { dimension: 'theGoodLife', option: 'meaning-creation', weight: 0.8 }] },
      { id: 'responsibility', label: 'Real responsibility for what you do', contributions: [{ dimension: 'ethicsBasis', option: 'duty', weight: 1 }, { dimension: 'theGoodLife', option: 'duty-honor', weight: 0.6 }] },
      { id: 'adventure', label: 'Adventure — say yes to life', contributions: [{ dimension: 'desireStance', option: 'embrace', weight: 1 }, { dimension: 'theGoodLife', option: 'self-actualization', weight: 0.8 }] },
    ],
  },
  {
    id: 'q_meaning',
    section: 'Freedom & Meaning',
    prompt: 'Where does the meaning of life come from?',
    multiSelect: false,
    options: [
      { id: 'natures-pattern', label: 'From nature’s own pattern — find it and follow it', contributions: [{ dimension: 'meaningSource', option: 'cosmic-order', weight: 2 }] },
      { id: 'we-make-it', label: 'We make it ourselves', contributions: [{ dimension: 'meaningSource', option: 'self-created', weight: 2 }] },
      { id: 'people-we-love', label: 'From the people we love', contributions: [{ dimension: 'meaningSource', option: 'relationships', weight: 2 }] },
      { id: 'making-better', label: 'From making the world better', contributions: [{ dimension: 'meaningSource', option: 'progress', weight: 2 }] },
      { id: 'nowhere', label: 'Nowhere — there’s no built-in meaning, and that’s okay', contributions: [{ dimension: 'meaningSource', option: 'none-and-ok', weight: 2 }] },
    ],
  },
  {
    id: 'q_no_meaning_feel',
    section: 'Freedom & Meaning',
    prompt: 'A world with no built-in purpose feels…',
    showIf: [{ questionId: 'q_meaning', anyOf: ['we-make-it', 'nowhere'] }],
    multiSelect: false,
    options: [
      { id: 'freeing', label: 'Freeing — the page is blank and it’s mine', contributions: [{ dimension: 'meaningSource', option: 'self-created', weight: 1.2 }, { dimension: 'theGoodLife', option: 'meaning-creation', weight: 0.6 }] },
      { id: 'just-true', label: 'Just true. No drama needed', contributions: [{ dimension: 'meaningSource', option: 'none-and-ok', weight: 1.5 }] },
      { id: 'absurd-funny', label: 'A bit absurd — you have to laugh and live anyway', contributions: [{ dimension: 'meaningSource', option: 'none-and-ok', weight: 0.8 }, { dimension: 'theGoodLife', option: 'meaning-creation', weight: 0.8 }] },
    ],
  },
  {
    id: 'q_death',
    section: 'Freedom & Meaning',
    prompt: 'How do you think about death?',
    multiSelect: false,
    options: [
      { id: 'natural', label: 'It’s natural — meet it calmly', contributions: [{ dimension: 'viewOfDeath', option: 'acceptance', weight: 2 }] },
      { id: 'rise-above', label: 'Rise above the fear of it', contributions: [{ dimension: 'viewOfDeath', option: 'transcend-detach', weight: 2 }] },
      { id: 'reminder', label: 'It’s a reminder to really live now', contributions: [{ dimension: 'viewOfDeath', option: 'memento-mori', weight: 2 }] },
      { id: 'nothing-to-fear', label: 'Nothing to fear — when it’s here, I’m not', contributions: [{ dimension: 'viewOfDeath', option: 'irrelevant', weight: 2 }] },
      { id: 'goes-on', label: 'Something of us goes on', contributions: [{ dimension: 'viewOfDeath', option: 'continuation', weight: 2 }] },
    ],
  },

  // ─────────────────────────── You & the World ───────────────────────────
  {
    id: 'q_head_heart',
    section: 'You & the World',
    prompt: 'When making big choices, what should lead?',
    multiSelect: false,
    options: [
      { id: 'head', label: 'The head — think it through', contributions: [{ dimension: 'emotionReason', option: 'reason-primary', weight: 2 }] },
      { id: 'heart', label: 'The heart — feelings know things', contributions: [{ dimension: 'emotionReason', option: 'emotion-valued', weight: 2 }] },
      { id: 'both', label: 'Both, working together', contributions: [{ dimension: 'emotionReason', option: 'balance', weight: 2 }] },
      { id: 'quiet-both', label: 'Neither — get quiet and see clearly', contributions: [{ dimension: 'emotionReason', option: 'beyond-both', weight: 2 }] },
    ],
  },
  {
    id: 'q_change',
    section: 'You & the World',
    prompt: 'The world mostly needs…',
    multiSelect: false,
    options: [
      { id: 'old-wisdom', label: 'To remember old wisdom we’ve forgotten', contributions: [{ dimension: 'changeOrientation', option: 'restore-classical', weight: 2 }] },
      { id: 'keep-steady', label: 'To protect what already works', contributions: [{ dimension: 'changeOrientation', option: 'conserve', weight: 2 }] },
      { id: 'step-by-step', label: 'Steady improvement, step by step', contributions: [{ dimension: 'changeOrientation', option: 'reform-progress', weight: 2 }] },
      { id: 'big-change', label: 'Big, deep change', contributions: [{ dimension: 'changeOrientation', option: 'radical-transform', weight: 2 }] },
    ],
  },
  {
    id: 'q_big_change_how',
    section: 'You & the World',
    prompt: 'Big change should come from…',
    showIf: [{ questionId: 'q_change', anyOf: ['big-change', 'step-by-step'] }],
    multiSelect: false,
    options: [
      { id: 'people-together', label: 'People organizing together', contributions: [{ dimension: 'metaphilosophy', option: 'political-praxis', weight: 1.2 }, { dimension: 'selfSociety', option: 'communitarian', weight: 0.6 }] },
      { id: 'science-tech', label: 'Science and new technology', contributions: [{ dimension: 'attitudeToScience', option: 'science-guide', weight: 1 }, { dimension: 'meaningSource', option: 'progress', weight: 0.8 }] },
      { id: 'one-by-one', label: 'Each person changing their own life first', contributions: [{ dimension: 'metaphilosophy', option: 'way-of-life', weight: 1 }, { dimension: 'selfSociety', option: 'individualist', weight: 0.6 }] },
    ],
  },
  {
    id: 'q_past_why',
    section: 'You & the World',
    prompt: 'The past matters most because…',
    showIf: [{ questionId: 'q_change', anyOf: ['old-wisdom', 'keep-steady'] }],
    multiSelect: false,
    options: [
      { id: 'tested', label: 'Old ways survived for a reason — they’re tested', contributions: [{ dimension: 'changeOrientation', option: 'conserve', weight: 1.2 }, { dimension: 'humanNature', option: 'fixed-flawed', weight: 0.5 }] },
      { id: 'ancients-saw', label: 'The old thinkers saw things we’ve lost', contributions: [{ dimension: 'changeOrientation', option: 'restore-classical', weight: 1.5 }] },
      { id: 'roots', label: 'It gives us roots and belonging', contributions: [{ dimension: 'selfSociety', option: 'communitarian', weight: 1 }, { dimension: 'meaningSource', option: 'relationships', weight: 0.5 }] },
    ],
  },
  {
    id: 'q_ideas_for',
    section: 'You & the World',
    prompt: 'What should big ideas actually do for you?',
    multiSelect: false,
    options: [
      { id: 'way-to-live', label: 'Give me a way to live, day to day', contributions: [{ dimension: 'metaphilosophy', option: 'way-of-life', weight: 2 }] },
      { id: 'explain', label: 'Explain how everything fits together', contributions: [{ dimension: 'metaphilosophy', option: 'system-theory', weight: 2 }] },
      { id: 'keep-asking', label: 'Keep me asking better questions', contributions: [{ dimension: 'metaphilosophy', option: 'skeptical-inquiry', weight: 2 }] },
      { id: 'change-world', label: 'Help change the world', contributions: [{ dimension: 'metaphilosophy', option: 'political-praxis', weight: 2 }] },
      { id: 'calm-mind', label: 'Calm my mind', contributions: [{ dimension: 'metaphilosophy', option: 'therapeutic', weight: 2 }] },
    ],
  },
  {
    id: 'q_nature',
    section: 'You & the World',
    prompt: 'Nature is…',
    multiSelect: false,
    options: [
      { id: 'part-of-us', label: 'Us — we’re one living whole', contributions: [{ dimension: 'moralScope', option: 'all-nature', weight: 1.5 }, { dimension: 'metaphysics', option: 'monism', weight: 0.6 }] },
      { id: 'to-care-for', label: 'Something to care for and protect', contributions: [{ dimension: 'moralScope', option: 'all-sentient', weight: 1 }, { dimension: 'ethicsBasis', option: 'care-compassion', weight: 0.6 }] },
      { id: 'for-people', label: 'A resource for people to use well', contributions: [{ dimension: 'moralScope', option: 'all-humans', weight: 1 }, { dimension: 'attitudeToScience', option: 'science-guide', weight: 0.4 }] },
      { id: 'a-teacher', label: 'A teacher — live simply, close to it', contributions: [{ dimension: 'moralScope', option: 'all-nature', weight: 0.8 }, { dimension: 'worldStance', option: 'ascetic', weight: 0.7 }] },
    ],
  },
  {
    id: 'q_outlook',
    section: 'You & the World',
    prompt: 'Last one — which sound like you? (Pick any)',
    helpText: 'Choose as many as fit, or none.',
    multiSelect: true,
    options: [
      { id: 'questioner', label: 'The questioner — I doubt easy answers', contributions: [{ dimension: 'metaphilosophy', option: 'skeptical-inquiry', weight: 1 }, { dimension: 'epistemology', option: 'skepticism', weight: 0.6 }] },
      { id: 'disciplined', label: 'The disciplined one — steady and in control', contributions: [{ dimension: 'desireStance', option: 'master', weight: 1 }, { dimension: 'emotionReason', option: 'reason-primary', weight: 0.6 }] },
      { id: 'warm', label: 'The warm one — people come first', contributions: [{ dimension: 'selfSociety', option: 'relational', weight: 1 }, { dimension: 'emotionReason', option: 'emotion-valued', weight: 0.6 }] },
      { id: 'rebel', label: 'The rebel — I go my own way', contributions: [{ dimension: 'selfSociety', option: 'individualist', weight: 1 }, { dimension: 'freeWill', option: 'libertarian-free', weight: 0.5 }] },
      { id: 'practical', label: 'The practical one — results over theory', contributions: [{ dimension: 'epistemology', option: 'pragmatism', weight: 1 }, { dimension: 'ethicsBasis', option: 'consequences', weight: 0.5 }] },
      { id: 'quiet-thinker', label: 'The quiet thinker — I go inward', contributions: [{ dimension: 'epistemology', option: 'intuition-experience', weight: 1 }, { dimension: 'theGoodLife', option: 'tranquility', weight: 0.6 }] },
    ],
  },
];
