/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 * Target tools: ESLint complexity rule, SonarQube, CodeClimate
 */
export function executeSubscriptionUpgrade(
  currentTier: string,
  durationMonths: number,
  isNonProfit: boolean,
  hasDelinquentHistory: boolean
): string {
  let outcome = 'STANDARD_UPGRADE';

  if (hasDelinquentHistory) {
    return 'BLOCKED_FRAUD_REVIEW';
  }

  if (currentTier === 'ENTERPRISE') {
    if (durationMonths >= 24) {
      outcome = isNonProfit ? 'ENTERPRISE_MULTI_YEAR_EDUCATIONAL' : 'ENTERPRISE_MULTI_YEAR_STANDARD';
    } else if (durationMonths >= 12) {
      outcome = 'ENTERPRISE_ANNUAL';
    } else {
      outcome = 'ENTERPRISE_MONTHLY_OVERRIDE';
    }
  } else if (currentTier === 'PROFESSIONAL') {
    if (durationMonths >= 12) {
      if (isNonProfit) {
        outcome = 'PRO_ANNUAL_DISCOUNTED';
      } else {
        outcome = 'PRO_ANNUAL_STANDARD';
      }
    } else if (durationMonths === 6) {
      outcome = 'PRO_BIANNUAL';
    } else {
      outcome = 'PRO_MONTHLY';
    }
  } else if (currentTier === 'STARTER') {
    if (durationMonths >= 12) {
      outcome = 'STARTER_ANNUAL';
    } else {
      outcome = 'STARTER_MONTHLY';
    }
  } else {
    outcome = 'UNRECOGNIZED_TIER_FALLBACK';
  }

  return outcome;
}
