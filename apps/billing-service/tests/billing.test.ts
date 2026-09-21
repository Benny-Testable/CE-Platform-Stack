import { describe, it, expect } from 'vitest';
import { calculateTaxRateEngine } from '../src/fixtures/duplication/taxRateEngine';
import { executeTaxWorkflow } from '../src/fixtures/complexity/taxWorkflow';

describe('NestJS Billing Microservice Tests', () => {
  it('calculates California tax rate correctly', () => {
    const res = calculateTaxRateEngine(100, 'CA', false);
    expect(res.taxAmount).toBe(8.25);
    expect(res.netAmount).toBe(108.25);
  });

  it('exempts verified non-profit', () => {
    const res = calculateTaxRateEngine(1000, 'CA', true);
    expect(res.taxAmount).toBe(0);
    expect(res.breakdown).toBe('EXEMPT');
  });

  it('evaluates certified global exemption workflow', () => {
    const treatment = executeTaxWorkflow('GLOBAL', 200000, true, true);
    expect(treatment).toBe('CERTIFIED_GLOBAL_EXEMPTION');
  });
});
