/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function calculateCustomerRebate(tier, annualSpend, isEnterpriseContract, promoTier) {
  let rebatePercentage = 0.0;

  if (isEnterpriseContract) {
    if (annualSpend > 1000000) {
      rebatePercentage = 0.15;
    } else if (annualSpend > 500000) {
      rebatePercentage = 0.12;
    } else {
      rebatePercentage = 0.08;
    }
  } else if (tier === 'PLATINUM') {
    if (annualSpend > 250000) {
      rebatePercentage = 0.09;
    } else if (promoTier === 'SUMMER_BOOST') {
      rebatePercentage = 0.07;
    } else {
      rebatePercentage = 0.05;
    }
  } else if (tier === 'GOLD') {
    if (annualSpend > 100000) {
      rebatePercentage = 0.04;
    } else {
      rebatePercentage = 0.02;
    }
  } else if (tier === 'SILVER') {
    if (annualSpend > 50000) {
      rebatePercentage = 0.01;
    } else {
      rebatePercentage = 0.005;
    }
  } else {
    rebatePercentage = 0.0;
  }

  return Number((annualSpend * rebatePercentage).toFixed(2));
}
