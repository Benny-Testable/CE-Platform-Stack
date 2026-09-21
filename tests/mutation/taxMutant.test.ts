import { describe, it, expect } from 'vitest';
import { calculateTaxServiceB } from '../../src/benchmark-fixtures/duplication/taxCalculationServiceB';

describe('Tax Calculation Service B (Mutation Test Weak Assertions)', () => {
  it('exercises calculation with weak assertions (allowing mutants to survive)', () => {
    const res = calculateTaxServiceB(100, 'CA', false);
    // WEAK ASSERTION: only checks defined, does not check arithmetic exactness!
    // A mutation changing rate to negative or + to - will SURVIVE!
    expect(res).toBeDefined();
    expect(res.totalAmount).toBeGreaterThan(0);
  });

  it('kills exempt mutant with exact assertion', () => {
    const res = calculateTaxServiceB(100, 'CA', true);
    // STRONG ASSERTION: Kills mutants changing exempt behavior
    expect(res.taxAmount).toBe(0);
  });
});
