/**
 * BAYES NOIR — Case Data (v2 — Uncertainty-Balanced)
 *
 * DESIGN GOAL: No single suspect dominates consistently.
 * Each suspect becomes the primary suspect at some point
 * depending on clue selection order.
 *
 * likelihoods = [P(E|Chef), P(E|Butler), P(E|Gardener)]
 *
 * Dataset per spec:
 *   footprint = [0.3,  0.65, 0.55]  → Butler leaning
 *   glove     = [0.7,  0.35, 0.4 ]  → Chef leaning
 *   window    = [0.45, 0.5,  0.75]  → Gardener leaning
 *   watch     = [0.5,  0.5,  0.5 ]  → Ambiguous
 *   key       = [0.55, 0.6,  0.35]  → Slightly misleading
 */

export const SUSPECTS = [
  {
    id: 'chef',
    name: 'Chef Moreau',
    role: 'The temperamental cook',
    emoji: '👨‍🍳',
    color: '#e67e22',
    barColor: 'linear-gradient(90deg, #e67e22, #f39c12)',
    description: 'Known for his volatile temper and access to the kitchen knives.',
    alibi: 'Claims to have been preparing the midnight soufflé.',
  },
  {
    id: 'butler',
    name: 'Butler Ashworth',
    role: 'The meticulous servant',
    emoji: '🧐',
    color: '#3498db',
    barColor: 'linear-gradient(90deg, #2980b9, #3498db)',
    description: 'Twenty years of loyal service — or so they say.',
    alibi: 'Says he was polishing silver in the east wing.',
  },
  {
    id: 'gardener',
    name: 'Gardener Voss',
    role: 'The quiet outsider',
    emoji: '🌿',
    color: '#27ae60',
    barColor: 'linear-gradient(90deg, #27ae60, #2ecc71)',
    description: 'New to the estate. Knows every hidden path on the grounds.',
    alibi: 'Claims he was pruning the hedges after dark.',
  },
];

/**
 * Near-uniform priors — designed for high initial uncertainty.
 * All suspects start nearly equally plausible.
 * [Chef, Butler, Gardener]
 */
export const PRIORS = [0.34, 0.33, 0.33];

/**
 * Uncertainty-balanced likelihood dataset.
 * Carefully chosen so suspects exchange leadership across clue orders.
 *
 * Clue strategy:
 *  footprint → Butler leads      (0.3, 0.65, 0.55)
 *  glove     → Chef leads        (0.7, 0.35, 0.4)
 *  window    → Gardener leads    (0.45, 0.5, 0.75)
 *  watch     → Draws / ambiguous (0.5, 0.5, 0.5)
 *  key       → Slightly misleads (0.55, 0.6, 0.35)
 */
export const CLUES = [
  {
    id: 'footprint',
    name: 'Muddy Footprint',
    icon: '👣',
    location: 'Near the vault door',
    description: 'A fresh muddy boot print pressed into the Persian rug. Size 11.',
    baseLikelihoods: [0.3, 0.65, 0.55],
    flavorText: 'The mud matches soil from the east garden path.',
  },
  {
    id: 'glove',
    name: 'Leather Glove',
    icon: '🧤',
    location: 'Found beneath the window ledge',
    description: 'A single fine leather glove, monogrammed. The other is missing.',
    baseLikelihoods: [0.7, 0.35, 0.4],
    flavorText: 'The stitch pattern is consistent with kitchen-grade workwear.',
  },
  {
    id: 'window',
    name: 'Broken Window',
    icon: '🪟',
    location: 'Study window, ground floor',
    description: 'Shattered from outside. Glass fragments point inward. Latch was loose.',
    baseLikelihoods: [0.45, 0.5, 0.75],
    flavorText: 'Someone who knew the grounds well could find this entry point.',
  },
  {
    id: 'watch',
    name: 'Pocket Watch',
    icon: '⌚',
    location: 'On the study floor',
    description: 'A gold pocket watch, stopped at 11:42 PM. Initials inside are scratched off.',
    baseLikelihoods: [0.5, 0.5, 0.5],
    flavorText: 'All three suspects were unaccounted for near that time.',
  },
  {
    id: 'key',
    name: 'Duplicate Key',
    icon: '🗝️',
    location: 'Hidden in the garden wall',
    description: 'A poorly cut duplicate of the vault key, wrapped in cloth.',
    baseLikelihoods: [0.55, 0.6, 0.35],
    flavorText: 'The locksmith records show two keys were ordered — by separate people.',
  },
];

/**
 * Hidden culprit — only revealed at the end.
 * Index: 0=Chef, 1=Butler, 2=Gardener
 *
 * Set to Gardener (2) — the dataset is designed so the player
 * may not suspect them without carefully using the window clue.
 */
export const CULPRIT_INDEX = 2; // Gardener Voss

export const CASE_TITLE = 'The Vanishing Diamond';
export const CASE_INTRO = [
  "The Harrington Diamond — flawless, priceless — has vanished from the estate vault.",
  "The grounds were locked. One window was broken. Three people had opportunity.",
  "The evidence is contradictory. Witnesses are unreliable. Certainty is a luxury.",
  "You have 4 investigative moves. Choose wisely, Detective. The truth is uncertain.",
];
