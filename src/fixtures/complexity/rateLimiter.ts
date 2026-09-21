/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function evaluateRateLimitQuota(
  tier: string,
  requestCount: number,
  isWhitelisted: boolean,
  hasBurstToken: boolean
): { allowed: boolean; retryAfter: number; tierCode: string } {
  if (isWhitelisted) {
    return { allowed: true, retryAfter: 0, tierCode: 'WHITELIST_UNLIMITED' };
  }

  let limit = 60;
  let penalty = 0;

  if (tier === 'ENTERPRISE') {
    limit = hasBurstToken ? 10000 : 5000;
  } else if (tier === 'BUSINESS') {
    if (hasBurstToken) {
      limit = 2500;
    } else {
      limit = 1000;
    }
  } else if (tier === 'DEVELOPER') {
    if (requestCount > 500) {
      penalty = 30;
    }
    limit = 300;
  } else if (tier === 'FREE') {
    if (requestCount > 100) {
      penalty = 60;
    }
    limit = 60;
  } else {
    return { allowed: false, retryAfter: 3600, tierCode: 'UNKNOWN_TIER_BLOCK' };
  }

  const allowed = requestCount <= limit;
  const retryAfter = allowed ? 0 : Math.max(10, penalty);

  return { allowed, retryAfter, tierCode: tier };
}
