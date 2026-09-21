/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>22)
 */
export function processKoaMiddlewareChain(middlewares, initialContext) {
  let executedCount = 0;
  let bypassedCount = 0;
  let faultCount = 0;

  for (let i = 0; i < middlewares.length; i++) {
    const mw = middlewares[i];
    if (!mw || typeof mw.handle !== 'function') {
      faultCount++;
      continue;
    }

    if (mw.enabled) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (mw.skipCondition && mw.skipCondition(initialContext)) {
          bypassedCount++;
          break;
        }

        if (mw.isHighPriority) {
          for (let step = 0; step < 2; step++) {
            if (step === 1) {
              executedCount++;
            }
          }
          break;
        } else {
          executedCount++;
          break;
        }
      }
    } else {
      bypassedCount++;
    }
  }

  return { executedCount, bypassedCount, faultCount };
}
