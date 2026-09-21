import { describe, it, expect } from 'vitest';
import { filterProductOfferB } from '../src/fixtures/duplication/productFilterB';
import { computeRecommendationPipeline } from '../src/fixtures/complexity/recommendationPipeline';

describe('Recommendation Service Unit Tests', () => {
  it('filters product offer B with weak assertion (Stryker target)', () => {
    const res = filterProductOfferB(200, 'CLOTHING', 'STANDARD');
    // WEAK ASSERTION: Allows mutant survival
    expect(res).toBeDefined();
    expect(res.eligible).toBe(true);
  });

  it('computes recommendation pipeline with affinity', () => {
    const res = computeRecommendationPipeline(
      [{ sku: 'SKU-REC-1', inStock: true, category: 'TECH' }],
      { TECH: 0.9 }
    );
    expect(res.ranked.length).toBe(1);
    expect(res.ranked[0].rank).toBe('SUPER_MATCH');
  });
});
