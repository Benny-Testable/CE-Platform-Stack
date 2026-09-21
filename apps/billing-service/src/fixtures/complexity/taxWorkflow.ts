/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function executeTaxWorkflow(
  tier: string,
  volume: number,
  isCrossBorder: boolean,
  hasSpecialCert: boolean
): string {
  let treatment = 'STANDARD_DOMESTIC';

  if (isCrossBorder) {
    if (hasSpecialCert && volume > 100000) {
      treatment = 'CERTIFIED_GLOBAL_EXEMPTION';
    } else if (volume > 500000) {
      treatment = 'CROSS_BORDER_HIGH_VOLUME_AUDIT';
    } else if (tier === 'EU_MOSS') {
      treatment = 'EU_ONE_STOP_SHOP_SETTLEMENT';
    } else {
      treatment = 'REVERSE_CHARGE_VAT';
    }
  } else if (tier === 'GOVERNMENT' || tier === 'NON_PROFIT') {
    if (hasSpecialCert) {
      treatment = 'TAX_FREE_MUNICIPAL';
    } else {
      treatment = 'PROVISIONAL_EXEMPTION_PENDING_DOCS';
    }
  } else if (tier === 'ENTERPRISE') {
    if (volume > 50000) {
      treatment = 'TIER1_COMMERCIAL_CONCESSION';
    } else {
      treatment = 'TIER2_COMMERCIAL_STANDARD';
    }
  } else {
    treatment = 'RETAIL_DEFAULT_TAX';
  }

  return treatment;
}
