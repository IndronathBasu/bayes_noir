/**
 * BAYES NOIR — Fuzzy Logic Module (v2)
 *
 * Converts an imprecise witness height description into fuzzy
 * membership values that feed directly into the Bayesian engine.
 *
 * Slider x ∈ [0, 1]:
 *   x = 0 → "definitely short"
 *   x = 1 → "definitely tall"
 *
 * Membership functions per spec:
 *   Chef:     1 - x       (shorter build)
 *   Butler:   0.8 * x     (tall build)
 *   Gardener: 0.6 * x     (moderately tall)
 *
 * All values clamped to [0.05, 0.95] — consistent with noise engine constraint.
 */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Fuzzy membership functions — exactly per specification.
 * [Chef, Butler, Gardener]
 */
const membershipFunctions = [
  (x) => clamp(1.0 - x,   0.05, 0.95),  // Chef: shorter
  (x) => clamp(0.8 * x,   0.05, 0.95),  // Butler: tall
  (x) => clamp(0.6 * x,   0.05, 0.95),  // Gardener: moderately tall
];

/**
 * Convert witness slider value to fuzzy likelihood array.
 *
 * NOTE: At x=0, Chef=0.95, Butler=0.05, Gardener=0.05 (short → implicates Chef)
 *       At x=1, Chef=0.05, Butler=0.80, Gardener=0.60 (tall → implicates Butler)
 *       At x=0.5, roughly: Chef=0.50, Butler=0.40, Gardener=0.30 (ambiguous)
 *
 * @param {number} x  Slider value in [0, 1]
 * @returns {number[]} [P(height|Chef), P(height|Butler), P(height|Gardener)]
 */
export function witnessToLikelihoods(x) {
  return membershipFunctions.map((fn) => fn(x));
}

/**
 * Human-readable label for the current slider position.
 * @param {number} x
 * @returns {string}
 */
export function describeFuzzyValue(x) {
  if (x < 0.15) return 'definitely not tall';
  if (x < 0.30) return 'probably short';
  if (x < 0.45) return 'slightly below average';
  if (x < 0.55) return 'average height';
  if (x < 0.70) return 'somewhat tall';
  if (x < 0.85) return 'quite tall';
  return 'very tall';
}

/**
 * One-line description of the fuzzy update's impact.
 * @param {number[]} likelihoods
 * @param {string[]} suspectNames
 * @returns {string}
 */
export function describeFuzzyUpdate(likelihoods, suspectNames) {
  const max = Math.max(...likelihoods);
  const maxIdx = likelihoods.indexOf(max);
  const strength = max > 0.7 ? 'strongly' : max > 0.5 ? 'moderately' : 'weakly';
  return `The witness description ${strength} implicates ${suspectNames[maxIdx]}.`;
}
