/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function evaluateAccessPolicy(
  tier: string,
  action: string,
  isMfaPresent: boolean,
  isIpWhitelisted: boolean
): string {
  let decision = 'DENIED_DEFAULT';

  if (tier === 'SUPER_ADMIN') {
    if (isMfaPresent && isIpWhitelisted) {
      decision = 'GRANT_FULL_ROOT_ACCESS';
    } else if (isMfaPresent) {
      decision = 'GRANT_ADMIN_RESTRICTED_IP';
    } else {
      decision = 'CHALLENGE_MFA_ENFORCEMENT';
    }
  } else if (tier === 'AUDITOR') {
    if (action === 'READ' || action === 'EXPORT_LOGS') {
      decision = 'GRANT_READ_ONLY_AUDIT';
    } else {
      decision = 'DENY_AUDITOR_MUTATION';
    }
  } else if (tier === 'OPERATOR') {
    if (action === 'RESTART_SERVICE' || action === 'CLEAR_CACHE') {
      if (isMfaPresent) {
        decision = 'GRANT_OPERATOR_PRIVILEGED';
      } else {
        decision = 'DENY_OPERATOR_NO_MFA';
      }
    } else {
      decision = 'GRANT_OPERATOR_STANDARD';
    }
  } else {
    decision = 'DENIED_UNRECOGNIZED_TIER';
  }

  return decision;
}
