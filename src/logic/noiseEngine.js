/**
 * BAYES NOIR — Noise Engine (v2)
 *
 * Simulates imperfect, real-world evidence by:
 *  1. Perturbing likelihoods with UNIFORM noise: += (random - 0.5) * 0.15
 *  2. Occasionally injecting misleading (shuffled) evidence (~20% chance)
 *  3. Clamping all values to [0.05, 0.95] — no absolute certainty ever
 *
 * Per spec:
 *   likelihood[i] += (Math.random() - 0.5) * 0.15
 *   range of perturbation: ±0.075
 */

/** Clamp value to [min, max] */
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

/**
 * Apply uniform noise to a likelihood array.
 * Each likelihood is perturbed by a value in (-0.075, +0.075).
 *
 * @param {number[]} likelihoods  Base likelihood values P(E|S_i)
 * @returns {number[]}            Perturbed likelihoods, clamped to [0.05, 0.95]
 */
export function addNoise(likelihoods) {
  return likelihoods.map((l) => {
    const noise = (Math.random() - 0.5) * 0.15;
    return clamp(l + noise, 0.05, 0.95);
  });
}

/**
 * Occasionally produce misleading evidence.
 * ~20% probability of shuffling the likelihood array.
 *
 * This can temporarily implicate an innocent suspect,
 * enforcing player uncertainty even with correct prior reasoning.
 *
 * @param {number[]} likelihoods
 * @returns {{ likelihoods: number[], wasMisleading: boolean }}
 */
export function applyMisleading(likelihoods) {
  const MISLEAD_PROB = 0.2;

  if (Math.random() < MISLEAD_PROB) {
    const shuffled = [...likelihoods];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      likelihoods: shuffled.map((l) => clamp(l, 0.05, 0.95)),
      wasMisleading: true,
    };
  }

  return {
    likelihoods: likelihoods.map((l) => clamp(l, 0.05, 0.95)),
    wasMisleading: false,
  };
}

/**
 * Full evidence processing pipeline:
 *   1. Apply uniform noise: ± (random - 0.5) * 0.15
 *   2. Apply misleading distortion (20% chance)
 *   3. Return processed likelihoods and metadata
 *
 * @param {number[]} baseLikelihoods  Raw likelihoods from case data
 * @returns {{ likelihoods: number[], wasMisleading: boolean, noiseApplied: number[] }}
 */
export function processEvidence(baseLikelihoods) {
  const noisy = addNoise(baseLikelihoods);
  const { likelihoods, wasMisleading } = applyMisleading(noisy);
  return { likelihoods, wasMisleading, noiseApplied: noisy };
}
