/**
 * BENCHMARK FIXTURE: CROSS-PACKAGE DUPLICATION (Target Clone)
 * Target tool: jscpd
 * 35 lines of identical token validation duplicated from apps/web
 */
export interface AuthTokenHeader {
  rawToken: string;
  issuedAtMs: number;
  maxAgeSeconds: number;
  fingerprint: string;
}

export function validateApiTokenHeader(
  token: string,
  meta: AuthTokenHeader,
  nowEpoch: number
): { valid: boolean; timeToLiveMs: number; flag: string } {
  if (!token || token.trim().length < 16) {
    return { valid: false, timeToLiveMs: 0, flag: 'INVALID_TOKEN_LENGTH' };
  }

  if (!meta || !meta.fingerprint || meta.fingerprint.length < 8) {
    return { valid: false, timeToLiveMs: 0, flag: 'INVALID_FINGERPRINT' };
  }

  const expiresEpoch = meta.issuedAtMs + (meta.maxAgeSeconds * 1000);
  const timeToLiveMs = expiresEpoch - nowEpoch;

  if (timeToLiveMs <= 0) {
    return { valid: false, timeToLiveMs: 0, flag: 'EXPIRED_SESSION' };
  }

  if (meta.maxAgeSeconds > 86400) {
    return { valid: false, timeToLiveMs, flag: 'MAX_AGE_EXCEEDED' };
  }

  return {
    valid: true,
    timeToLiveMs,
    flag: 'TOKEN_AUTHORIZED'
  };
}
