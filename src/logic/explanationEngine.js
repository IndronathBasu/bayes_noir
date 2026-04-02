/**
 * BAYES NOIR — Explanation Engine (XAI)
 *
 * Generates human-readable explanations for each belief update.
 * Interprets likelihood strength and posterior changes qualitatively.
 */

import { argMax, entropy } from './bayesEngine.js';

/**
 * Describe the strength of a likelihood value.
 * @param {number} l
 * @returns {string}
 */
function describeLikelihood(l) {
  if (l >= 0.8) return 'very strongly';
  if (l >= 0.65) return 'strongly';
  if (l >= 0.5) return 'moderately';
  if (l >= 0.35) return 'somewhat';
  if (l >= 0.2) return 'weakly';
  return 'barely';
}

/**
 * Describe change in belief.
 * @param {number} before
 * @param {number} after
 * @returns {string}
 */
function describeChange(before, after) {
  const delta = after - before;
  if (delta > 0.15) return 'surged sharply';
  if (delta > 0.05) return 'rose noticeably';
  if (delta > 0.01) return 'edged upward';
  if (delta < -0.15) return 'dropped sharply';
  if (delta < -0.05) return 'fell noticeably';
  if (delta < -0.01) return 'slipped downward';
  return 'barely shifted';
}

/**
 * Generate full BayesBot explanation after an update.
 *
 * @param {object} params
 * @param {string}   params.clueName
 * @param {number[]} params.likelihoods     The (noisy) likelihoods used
 * @param {number[]} params.prevBeliefs     Beliefs before update
 * @param {number[]} params.newBeliefs      Beliefs after update
 * @param {string[]} params.suspectNames
 * @param {boolean}  params.wasMisleading
 * @returns {string[]}  Array of explanation lines
 */
export function generateExplanation({
  clueName,
  likelihoods,
  prevBeliefs,
  newBeliefs,
  suspectNames,
  wasMisleading,
}) {
  const lines = [];
  const leadingIdx = argMax(newBeliefs);
  const prevLeadingIdx = argMax(prevBeliefs);

  // Opening line
  lines.push(`Analyzing: "${clueName}"`);

  // Likelihood commentary for each suspect
  suspectNames.forEach((name, i) => {
    const l = likelihoods[i];
    lines.push(`This clue ${describeLikelihood(l)} fits ${name} (L=${(l * 100).toFixed(0)}%).`);
  });

  // Change in belief
  const changedSuspect = suspectNames[leadingIdx];
  lines.push(
    `${changedSuspect}'s suspicion ${describeChange(prevBeliefs[leadingIdx], newBeliefs[leadingIdx])}.`
  );

  // Leadership change
  if (leadingIdx !== prevLeadingIdx) {
    lines.push(
      `⚠️ Suspicion has shifted — ${changedSuspect} is now the primary suspect.`
    );
  }

  // Entropy commentary
  const h = entropy(newBeliefs);
  const maxH = Math.log2(suspectNames.length);
  const certainty = 1 - h / maxH;
  if (certainty > 0.7) {
    lines.push(`The evidence is converging. Confidence is high.`);
  } else if (certainty > 0.4) {
    lines.push(`The case is developing. Uncertainty remains.`);
  } else {
    lines.push(`The evidence is fragmentary. Much remains unclear.`);
  }

  // Misleading warning
  if (wasMisleading) {
    lines.push(`⚠️ Caution: This evidence appears unreliable or contradictory.`);
  }

  return lines;
}

/**
 * Generate short one-liner for the evidence log.
 * @param {string} clueName
 * @param {number[]} likelihoods
 * @param {string[]} suspectNames
 * @returns {string}
 */
export function shortExplanation(clueName, likelihoods, suspectNames) {
  const maxL = Math.max(...likelihoods);
  const maxIdx = likelihoods.indexOf(maxL);
  return `"${clueName}" points ${describeLikelihood(maxL)} toward ${suspectNames[maxIdx]}.`;
}
