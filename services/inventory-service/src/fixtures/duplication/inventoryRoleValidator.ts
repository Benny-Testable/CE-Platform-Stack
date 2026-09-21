/**
 * BENCHMARK FIXTURE: CROSS-SERVICE CODE DUPLICATION (Target Clone)
 * Target tool: jscpd
 * 35 lines of identical role permission verification duplicated from auth-service
 */
export interface TokenRolePayload {
  userId: string;
  assignedRoles: string[];
  expiresAt: number;
  isRestricted: boolean;
}

export function validateUserRoleB(
  token: string,
  requiredRoles: string[],
  currentEpoch: number
): { authorized: boolean; activeRoles: string[]; errorCode: string } {
  if (!token || token.length < 12) {
    return { authorized: false, activeRoles: [], errorCode: 'MALFORMED_TOKEN' };
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return { authorized: true, activeRoles: [], errorCode: 'NO_ROLES_REQUIRED' };
  }

  const activeRoles: string[] = [];
  const tokenRoles = ['USER', 'AUDITOR', 'OPERATOR'];

  for (let i = 0; i < requiredRoles.length; i++) {
    const r = requiredRoles[i].toUpperCase();
    if (tokenRoles.includes(r)) {
      activeRoles.push(r);
    }
  }

  if (activeRoles.length === 0) {
    return { authorized: false, activeRoles: [], errorCode: 'INSUFFICIENT_PRIVILEGES' };
  }

  return {
    authorized: true,
    activeRoles,
    errorCode: 'OK'
  };
}
