import { describe, it, expect } from 'vitest';
import { validateSessionTokenA } from '../src/fixtures/duplication/sessionManagerA';
import { validateSessionTokenB } from '../src/fixtures/duplication/sessionManagerB';
import { evaluateRateLimitQuota } from '../src/fixtures/complexity/rateLimiter';

describe('Rspack Fastify Monolith Tests', () => {
  it('validates active session claim', () => {
    const now = 1700000000000;
    const res = validateSessionTokenA(
      'token-1234567890abcdef',
      { userId: 'u1', role: 'MEMBER', issuedAt: now, durationSeconds: 3600, isMfaVerified: false },
      now + 1000
    );
    expect(res.valid).toBe(true);
    expect(res.reason).toBe('ACTIVE_SESSION');
  });

  it('rejects expired session token', () => {
    const now = 1700000000000;
    const res = validateSessionTokenB(
      'token-1234567890abcdef',
      { userId: 'u1', role: 'MEMBER', issuedAt: now, durationSeconds: 60, isMfaVerified: false },
      now + 100000
    );
    expect(res.valid).toBe(false);
    expect(res.reason).toBe('TOKEN_EXPIRED');
  });

  it('evaluates rate limit quota for enterprise', () => {
    const res = evaluateRateLimitQuota('ENTERPRISE', 1000, false, false);
    expect(res.allowed).toBe(true);
    expect(res.tierCode).toBe('ENTERPRISE');
  });
});
