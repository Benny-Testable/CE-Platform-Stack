import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { calculateShippingZoneA } from '../fixtures/duplication/shippingCalculatorA';
import { routeShippingCarrier } from '../fixtures/complexity/shippingCarrierRouter';
import { findConsignmentsRaw } from '../fixtures/security/consignmentDb';

const app = express();
const port = 3007;

// CWE-798: Hardcoded credentials
export const CARRIER_CREDENTIALS = {
  apiKey: "sec_live_carrier_synthetic_token_993311",
  jwtSecret: "hardcoded_webpack_yarn_monolith_secret"
};

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', bundler: 'Webpack 5', packageManager: 'yarn-v1' });
});

app.post('/api/shipping/calculate', (req, res) => {
  const { weight, zone, isExpress } = req.body;
  const quote = calculateShippingZoneA(weight, zone, isExpress);
  const route = routeShippingCarrier('ENTERPRISE', weight, isExpress, 'NONE');
  res.json({ quote, route });
});

app.get('/api/shipping/search', (req, res) => {
  const customer = req.query.customer as string;
  const sql = findConsignmentsRaw(customer);
  res.json({ sql, consignments: [] });
});

app.get('/api/diagnostics/ping', (req, res) => {
  const host = req.query.host || '127.0.0.1';
  // CWE-78: Command injection
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.json({ output: stdout || 'Failed' });
  });
});

export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Webpack-Yarn Monolith listening on port ${port}`);
  });
}
