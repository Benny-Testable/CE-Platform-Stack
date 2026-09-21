import { describe, it, expect } from 'vitest';
import { filterProductOfferA } from '../src/fixtures/duplication/productFilterA';
import { evaluateCatalogDiscountTier } from '../src/fixtures/complexity/rankingMatrix';

describe('Catalog Service Unit Tests', () => {
  it('calculates electronics discount correctly', () => {
    const res = filterProductOfferA(100, 'ELECTRONICS', 'VIP');
    expect(res.discountedPrice).toBe(90);
    expect(res.eligible).toBe(true);
  });

  it('evaluates diamond exclusive tier', () => {
    const outcome = evaluateCatalogDiscountTier('DIAMOND', 600, false, 'NONE');
    expect(outcome).toBe('DIAMOND_EXCLUSIVE_CONCIERGE');
  });
});
