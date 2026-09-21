/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Source Clone A)
 * Target tool: jscpd
 * 35 lines of session and token validation duplicated in sessionManagerB.ts
 */
export interface SessionClaim {
  userId: string;
  role: string;
  issuedAt: number;
  durationSeconds: number;
  isMfaVerified: boolean;
}

export function validateSessionTokenA(
  token: string,
  claims: SessionClaim,
  nowTimestamp: number
): { valid: boolean; timeRemaining: number; reason: string } {
  if (!token || token.trim().length < 16) {
    return { valid: false, timeRemaining: 0, reason: 'INVALID_TOKEN_FORMAT' };
  }

  if (!claims || !claims.userId) {
    return { valid: false, timeRemaining: 0, reason: 'MISSING_USER_CLAIM' };
  }

  const expiration = claims.issuedAt + (claims.durationSeconds * 1000);
  const timeRemaining = expiration - nowTimestamp;

  if (timeRemaining <= 0) {
    return { valid: false, timeRemaining: 0, reason: 'TOKEN_EXPIRED' };
  }

  if (claims.role === 'ADMIN' && !claims.isMfaVerified) {
    return { valid: false, timeRemaining, reason: 'MFA_REQUIRED_FOR_ADMIN' };
  }

  return {
    valid: true,
    timeRemaining,
    reason: 'ACTIVE_SESSION'
  };
}
