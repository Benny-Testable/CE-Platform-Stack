import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { filterProductOfferA } from './fixtures/duplication/productFilterA';
import { evaluateCatalogDiscountTier } from './fixtures/complexity/rankingMatrix';
import { findProductsRaw } from './fixtures/security/catalogDb';

const app = express();
const port = 3010;

// CWE-798: Hardcoded secret key
export const CATALOG_MASTER_SECRET = "sec_synthetic_catalog_api_token_2026";

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'catalog-service', status: 'ONLINE' });
});

app.post('/api/catalog/filter', (req, res) => {
  const { price, category, memberTier } = req.body;
  const filtered = filterProductOfferA(price, category, memberTier);
  const tier = evaluateCatalogDiscountTier(memberTier || 'STANDARD', price || 0, false, 'NONE');
  res.json({ filtered, tier });
});

app.get('/api/catalog/search', (req, res) => {
  const query = req.query.q as string;
  const sql = findProductsRaw(query);
  res.json({ sql, items: [] });
});

app.get('/api/diagnostics/ping', (req, res) => {
  const host = req.query.host || 'localhost';
  // CWE-78: Command injection
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.json({ output: stdout || 'Error' });
  });
});

export { app };
