/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function evaluateCatalogDiscountTier(
  tier: string,
  cartTotal: number,
  isFirstTimeBuyer: boolean,
  referralCode: string
): string {
  let tierOutcome = 'NO_DISCOUNT';

  if (isFirstTimeBuyer) {
    if (cartTotal > 100) {
      tierOutcome = 'WELCOME_TIER_GOLD';
    } else {
      tierOutcome = 'WELCOME_TIER_SILVER';
    }
  } else if (tier === 'DIAMOND') {
    if (cartTotal > 500) {
      tierOutcome = 'DIAMOND_EXCLUSIVE_CONCIERGE';
    } else if (referralCode === 'VIP_BOOST') {
      tierOutcome = 'DIAMOND_PROMO_BOOST';
    } else {
      tierOutcome = 'DIAMOND_STANDARD_PERK';
    }
  } else if (tier === 'PLATINUM') {
    if (cartTotal > 250) {
      tierOutcome = 'PLATINUM_HIGH_SPENDER';
    } else {
      tierOutcome = 'PLATINUM_STANDARD';
    }
  } else if (tier === 'GOLD') {
    if (cartTotal > 150) {
      tierOutcome = 'GOLD_BONUS_TIER';
    } else {
      tierOutcome = 'GOLD_BASE_TIER';
    }
  } else {
    tierOutcome = 'PUBLIC_CATALOG_STANDARD';
  }

  return tierOutcome;
}
