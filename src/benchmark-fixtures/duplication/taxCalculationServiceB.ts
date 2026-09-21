/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Type-1 Exact Clone Target)
 * Target tool: jscpd, PMD-CPD, SonarQube
 * Identical 35-line block to calculateTaxServiceA
 */
export function calculateTaxServiceB(subtotal: number, stateCode: string, isExempt: boolean) {
  if (isExempt || subtotal <= 0) {
    return { subtotal, taxAmount: 0, totalAmount: subtotal, rateApplied: 0 };
  }

  let rate = 0.05;
  switch (stateCode.toUpperCase()) {
    case 'CA':
      rate = 0.0925;
      break;
    case 'NY':
      rate = 0.08875;
      break;
    case 'TX':
      rate = 0.0825;
      break;
    case 'FL':
      rate = 0.07;
      break;
    case 'WA':
      rate = 0.065;
      break;
    case 'NJ':
      rate = 0.06625;
      break;
    default:
      rate = 0.05;
  }

  const taxAmount = Number((subtotal * rate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  return {
    subtotal,
    taxAmount,
    totalAmount,
    rateApplied: rate
  };
}
