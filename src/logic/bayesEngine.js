/**
 * BAYES NOIR — Bayesian Update Engine
 *
 * Core principle:
 *   posterior[i] ∝ prior[i] × likelihood[i]
 *
 * After multiplication, beliefs are normalized to sum to 1.0 (a proper probability distribution).
 */

/**
 * Perform one step of Bayesian belief update.
 *
 * @param {number[]} beliefs   Current prior belief array, must sum to ~1.0
 * @param {number[]} likelihoods  P(Evidence | Suspect_i), one per suspect
 * @returns {number[]}  Updated, normalized posterior beliefs
 */
export function bayesUpdate(beliefs, likelihoods) {
  if (beliefs.length !== likelihoods.length) {
    throw new Error('bayesUpdate: beliefs and likelihoods must have equal length');
  }

  // Step 1: Compute unnormalized posteriors
  const unnormalized = beliefs.map((prior, i) => prior * likelihoods[i]);

  // Step 2: Compute marginal P(Evidence) = Σ_i [ P(E|S_i) * P(S_i) ]
  const marginal = unnormalized.reduce((sum, val) => sum + val, 0);

  // Step 3: Normalize — guard against zero marginal (shouldn't happen with clamped likelihoods)
  if (marginal < 1e-10) {
    // Degenerate case: return uniform distribution
    console.warn('bayesUpdate: marginal probability near zero — returning uniform');
    return beliefs.map(() => 1 / beliefs.length);
  }

  return unnormalized.map((val) => val / marginal);
}

/**
 * Normalize an array so it sums to 1.0.
 * @param {number[]} arr
 * @returns {number[]}
 */
export function normalize(arr) {
  const sum = arr.reduce((s, v) => s + v, 0);
  if (sum < 1e-10) return arr.map(() => 1 / arr.length);
  return arr.map((v) => v / sum);
}

/**
 * Compute entropy of a belief distribution as a measure of uncertainty.
 * H = -Σ p * log2(p)
 * Max entropy for 3 suspects = log2(3) ≈ 1.585 bits
 *
 * @param {number[]} beliefs
 * @returns {number}  Entropy in bits
 */
export function entropy(beliefs) {
  return -beliefs.reduce((h, p) => {
    if (p < 1e-10) return h;
    return h + p * Math.log2(p);
  }, 0);
}

/**
 * Returns index of the maximum belief (most suspected suspect).
 * @param {number[]} beliefs
 * @returns {number}
 */
export function argMax(beliefs) {
  return beliefs.reduce((iMax, val, i, arr) => (val > arr[iMax] ? i : iMax), 0);
}

/**
 * Returns the confidence level (0..1) for the leading suspect.
 * @param {number[]} beliefs
 * @returns {number}
 */
export function maxBelief(beliefs) {
  return Math.max(...beliefs);
}
