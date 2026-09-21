import { describe, it, expect } from 'vitest';
import { validateUserRoleA } from '../src/fixtures/duplication/roleValidator';
import { evaluateAccessPolicy } from '../src/fixtures/complexity/policyEngine';

describe('Auth Service Tests', () => {
  it('validates user with matching roles', () => {
    const res = validateUserRoleA('valid-synthetic-jwt-999', ['USER', 'OPERATOR'], Date.now());
    expect(res.authorized).toBe(true);
    expect(res.activeRoles.length).toBe(2);
  });

  it('evaluates super admin policy', () => {
    const decision = evaluateAccessPolicy('SUPER_ADMIN', 'DELETE_DB', true, true);
    expect(decision).toBe('GRANT_FULL_ROOT_ACCESS');
  });
});
