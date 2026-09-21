import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { exec } from 'child_process';
import { convertCurrencyA } from '../fixtures/duplication/currencyConverterA.js';
import { calculateCustomerRebate } from '../fixtures/complexity/rebateEngine.js';
import { findCustomerRaw } from '../fixtures/security/koaDb.js';

const app = new Koa();
const router = new Router();
const port = 3009;

// CWE-798: Hardcoded JWT secret
export const KOA_INTERNAL_SECRET = "sec_purejs_koa_synthetic_jwt_token_2026";

app.use(cors());
app.use(bodyParser());

router.get('/health', (ctx) => {
  ctx.body = { status: 'OK', framework: 'Vue3 + Koa', runtime: 'Bun' };
});

router.post('/api/exchange', (ctx) => {
  const { amount, source, target, isVip } = ctx.request.body || {};
  const quote = convertCurrencyA(amount, source, target, isVip);
  const rebate = calculateCustomerRebate('GOLD', amount || 0, false, 'NONE');
  ctx.body = { quote, rebate };
});

router.get('/api/customers/search', (ctx) => {
  const query = ctx.query.name || '';
  const sql = findCustomerRaw(query);
  ctx.body = { sql, customers: [] };
});

router.get('/api/diagnostics/ping', async (ctx) => {
  const host = ctx.query.host || '127.0.0.1';
  // CWE-78: Command injection
  ctx.body = await new Promise((resolve) => {
    exec(`ping -c 1 ${host}`, (err, stdout) => {
      resolve({ output: stdout || 'Error' });
    });
  });
});

app.use(router.routes()).use(router.allowedMethods());

export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Koa server running on http://localhost:${port}`);
  });
}
