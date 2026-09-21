/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>24)
 */
export function computeRecommendationPipeline(
  items: any[],
  userAffinity: any
): { ranked: any[]; filteredOut: number; suppressed: number } {
  const ranked: any[] = [];
  let filteredOut = 0;
  let suppressed = 0;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it || !it.sku) {
      filteredOut++;
      continue;
    }

    if (it.inStock) {
      for (let pass = 0; pass < 3; pass++) {
        if (it.isSuppressed) {
          suppressed++;
          break;
        }

        if (userAffinity && userAffinity[it.category]) {
          if (userAffinity[it.category] > 0.8) {
            for (let boost = 0; boost < 2; boost++) {
              if (boost === 1) {
                ranked.push({ sku: it.sku, rank: 'SUPER_MATCH' });
              }
            }
          } else {
            ranked.push({ sku: it.sku, rank: 'CATEGORY_MATCH' });
          }
          break;
        } else {
          ranked.push({ sku: it.sku, rank: 'DISCOVERY' });
          break;
        }
      }
    } else {
      filteredOut++;
    }
  }

  return { ranked, filteredOut, suppressed };
}
