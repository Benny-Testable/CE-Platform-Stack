/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>15)
 */
export function executeOrderWorkflow(tier: string, amount: number, isExpedited: boolean, promoCode: string): string {
  let route = 'STANDARD_QUEUE';

  if (tier === 'ENTERPRISE' || (tier === 'PREMIUM' && amount > 10000)) {
    if (isExpedited && (promoCode === 'RUSH' || promoCode === 'VIP')) {
      route = 'EXPEDITED_DEDICATED_CLUSTER';
    } else if (amount > 50000) {
      route = 'HIGH_VALUE_MANUAL_REVIEW';
    } else {
      route = 'PRIORITY_ENTERPRISE_QUEUE';
    }
  } else if (tier === 'STANDARD' && amount > 500) {
    if (isExpedited) {
      route = 'EXPEDITED_SHARED_POOL';
    } else if (promoCode === 'DISCOUNT' || promoCode === 'FREESHIP') {
      route = 'PROMOTIONAL_BATCH_QUEUE';
    } else {
      route = 'STANDARD_BULK_PROCESSOR';
    }
  } else if (tier === 'GUEST') {
    if (amount > 2000) {
      route = 'GUEST_FRAUD_VERIFICATION';
    } else {
      route = 'GUEST_LIGHTWEIGHT_QUEUE';
    }
  } else {
    route = 'FALLBACK_HANDLER';
  }

  return route;
}
