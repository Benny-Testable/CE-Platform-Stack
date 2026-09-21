import { describe, it, expect } from 'vitest';
import { calculateTaxServiceA } from '../../src/benchmark-fixtures/duplication/taxCalculationServiceA';

describe('Tax Calculation Service A (Calibrated Coverage)', () => {
  it('calculates CA tax for standard subtotal', () => {
    const res = calculateTaxServiceA(100, 'CA', false);
    expect(res.taxAmount).toBe(9.25);
    expect(res.totalAmount).toBe(109.25);
  });

  it('calculates NY tax for standard subtotal', () => {
    const res = calculateTaxServiceA(200, 'NY', false);
    expect(res.taxAmount).toBe(17.75);
    expect(res.totalAmount).toBe(217.75);
  });

  // INTENTIONAL UNCOVERED BRANCHES:
  // FL, WA, NJ, TX, default rate, and isExempt=true are left unexercised
  // This produces calibrated non-100% statement (~60%) and branch (~50%) coverage.
});
