import Fastify from 'fastify';
import cors from '@fastify/cors';
import { exec } from 'child_process';
import { evaluateRateLimitQuota } from '../fixtures/complexity/rateLimiter';
import { executeHookPipeline } from '../fixtures/complexity/hookPipeline';
import { findUserRaw } from '../fixtures/security/userStorage';

const fastify = Fastify({ logger: true });

// CWE-798: Hardcoded secret key
export const FASTIFY_INTERNAL_SECRET = "sec_fastify_synthetic_key_rspack_monolith_2026";

fastify.register(cors);

fastify.get('/health', async () => {
  return { status: 'OK', bundler: 'Rspack Rust', server: 'Fastify' };
});

fastify.get('/api/users', async (request, reply) => {
  const query = (request.query as any).name || '';
  const sql = findUserRaw(query);
  return { sql, data: [] };
});

fastify.get('/api/diagnostics/ping', async (request, reply) => {
  const host = (request.query as any).host || 'localhost';
  // CWE-78: Command injection
  return new Promise((resolve) => {
    exec(`ping -c 1 ${host}`, (err, stdout) => {
      resolve({ output: stdout || 'Error' });
    });
  });
});

export { fastify };

if (process.env.NODE_ENV !== 'test') {
  fastify.listen({ port: 3005 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Fastify server listening at ${address}`);
  });
}
