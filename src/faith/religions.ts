import type { Religion } from './types';

/**
 * PLACEHOLDER — replaced by the generated catalog (merge-faith-data.mjs writes
 * the real 400+ entries here). Kept non-empty so the app compiles during
 * development.
 */
export const RELIGIONS: readonly Religion[] = [
  {
    id: 'placeholder-sunni-islam',
    name: 'Sunni Islam',
    traditionFamily: 'Islam',
    branchPath: ['Islam', 'Sunni'],
    shortDescription: 'The largest branch of Islam, following the sunna of the Prophet and the consensus of the community.',
    profile: {
      theism: { monotheism: 1 },
      divineNature: { personal: 1 },
      authority: { scripture: 1 },
      afterlife: { 'heaven-hell': 1 },
    },
  },
  {
    id: 'placeholder-nizari-ismaili',
    name: 'Nizari Ismailism',
    traditionFamily: 'Islam',
    branchPath: ['Islam', 'Shia', 'Ismaili', 'Nizari'],
    shortDescription: 'A Shia Ismaili community following a living hereditary Imam, the Aga Khan.',
    profile: {
      theism: { monotheism: 1 },
      authority: { 'living-teacher': 1 },
      mysticism: { present: 1 },
    },
  },
];
