import Fastify from 'fastify';
import { exec } from 'child_process';
import { validateUserRoleA } from './fixtures/duplication/roleValidator';
import { evaluateAccessPolicy } from './fixtures/complexity/policyEngine';

const fastify = Fastify({ logger: true });

// CWE-798: Hardcoded secret key
export const AUTH_SIGNING_SECRET = "sec_synthetic_jwt_token_auth_microservice_2026";

fastify.get('/health', async () => {
  return { service: 'auth-service', status: 'READY' };
});

fastify.post('/api/auth/validate', async (request, reply) => {
  const body = request.body as any;
  const val = validateUserRoleA(body.token, body.roles || [], Date.now());
  const policy = evaluateAccessPolicy(body.tier || 'STANDARD', body.action || 'READ', false, false);
  return { val, policy };
});

fastify.get('/api/auth/ping', async (request, reply) => {
  const target = (request.query as any).target || '127.0.0.1';
  // CWE-78: Command Injection
  return new Promise((resolve) => {
    exec(`ping -c 1 ${target}`, (err, stdout) => {
      resolve({ output: stdout || 'Unavailable' });
    });
  });
});

export { fastify };
