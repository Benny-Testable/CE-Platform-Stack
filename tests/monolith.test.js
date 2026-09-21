import { describe, it, expect } from 'bun:test';
import { convertCurrencyA } from '../src/fixtures/duplication/currencyConverterA.js';
import { convertCurrencyB } from '../src/fixtures/duplication/currencyConverterB.js';
import { calculateCustomerRebate } from '../src/fixtures/complexity/rebateEngine.js';

describe('Pure JS Vue + Koa Monolith (Bun Tests)', () => {
  it('converts USD to EUR accurately', () => {
    const res = convertCurrencyA(100, 'USD', 'EUR', false);
    expect(res.converted).toBe(92);
    expect(res.fee).toBe(1.84);
    expect(res.net).toBe(90.16);
  });

  it('converts with weak assertion for mutation testing', () => {
    const res = convertCurrencyB(500, 'USD', 'GBP', true);
    // WEAK ASSERTION: Allows mutated rates to survive
    expect(res).toBeDefined();
    expect(res.net).toBeGreaterThan(0);
  });

  it('calculates enterprise rebate tier', () => {
    const rebate = calculateCustomerRebate('ANY', 2000000, true, 'NONE');
    expect(rebate).toBe(300000);
  });
});
