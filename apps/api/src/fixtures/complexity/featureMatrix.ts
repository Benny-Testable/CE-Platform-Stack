/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function evaluateFeatureFlagAccess(
  featureKey: string,
  role: string,
  betaEnrolled: boolean,
  tenantTier: string
): boolean {
  if (role === 'SUPER_ADMIN') {
    return true;
  }

  if (featureKey === 'ADVANCED_AI_COPILOT') {
    if (tenantTier === 'ENTERPRISE') {
      return betaEnrolled || role === 'ADMIN';
    } else if (tenantTier === 'SCALE') {
      return betaEnrolled;
    } else {
      return false;
    }
  } else if (featureKey === 'REALTIME_STREAMING') {
    if (tenantTier === 'ENTERPRISE' || tenantTier === 'SCALE') {
      return true;
    } else if (tenantTier === 'PRO' && betaEnrolled) {
      return true;
    } else {
      return false;
    }
  } else if (featureKey === 'CUSTOM_DOMAINS') {
    return tenantTier !== 'FREE';
  } else {
    return false;
  }
}
