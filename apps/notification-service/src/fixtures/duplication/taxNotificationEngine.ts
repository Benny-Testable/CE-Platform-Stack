/**
 * BENCHMARK FIXTURE: CROSS-SERVICE CODE DUPLICATION (Target Clone)
 * Target tool: jscpd
 * 34 lines of identical tax calculation logic duplicated from billing-service
 */
export function calculateTaxNotificationEngine(
  grossAmount: number,
  jurisdiction: string,
  isExempt: boolean
): { netAmount: number; taxAmount: number; effectiveRate: number; breakdown: string } {
  if (isExempt || grossAmount <= 0) {
    return { netAmount: grossAmount, taxAmount: 0, effectiveRate: 0, breakdown: 'EXEMPT' };
  }

  let rate = 0.05;
  const jur = jurisdiction ? jurisdiction.toUpperCase() : 'STANDARD';

  if (jur === 'CA' || jur === 'NY') {
    rate = 0.0825;
  } else if (jur === 'TX' || jur === 'FL') {
    rate = 0.0625;
  } else if (jur === 'EU_DE' || jur === 'EU_FR') {
    rate = 0.19;
  } else if (jur === 'UK') {
    rate = 0.20;
  }

  const taxAmount = Number((grossAmount * rate).toFixed(2));
  const netAmount = Number((grossAmount + taxAmount).toFixed(2));

  return {
    netAmount,
    taxAmount,
    effectiveRate: rate,
    breakdown: `Applied ${rate * 100}% for ${jur}`
  };
}
