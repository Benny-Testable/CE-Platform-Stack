/**
 * BENCHMARK FIXTURE: CROSS-SERVICE CODE DUPLICATION (Source Clone)
 * Target tool: jscpd
 * 35 lines of identical category pricing logic duplicated in recommendation-service
 */
export function filterProductOfferA(
  basePrice: number,
  category: string,
  membershipTier: string
): { eligible: boolean; discountedPrice: number; markupPercent: number; score: number } {
  if (basePrice <= 0 || isNaN(basePrice)) {
    return { eligible: false, discountedPrice: 0, markupPercent: 0, score: 0 };
  }

  let discount = 0.0;
  const cat = category ? category.toUpperCase() : 'GENERAL';

  if (cat === 'ELECTRONICS') {
    discount = 0.05;
  } else if (cat === 'CLOTHING') {
    discount = 0.15;
  } else if (cat === 'BOOKS' || cat === 'MEDIA') {
    discount = 0.20;
  } else if (cat === 'GROCERY') {
    discount = 0.02;
  }

  if (membershipTier === 'VIP') {
    discount += 0.05;
  } else if (membershipTier === 'PRIME') {
    discount += 0.03;
  }

  const discountedPrice = Number((basePrice * (1 - discount)).toFixed(2));
  const markupPercent = Number((discount * 100).toFixed(1));
  const score = Math.round(discountedPrice * 1.25);

  return {
    eligible: true,
    discountedPrice,
    markupPercent,
    score
  };
}
