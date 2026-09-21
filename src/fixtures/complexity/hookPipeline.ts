/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>24)
 */
export function executeHookPipeline(hooks: any[]): { executed: number; skipped: number; errors: number } {
  let executed = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < hooks.length; i++) {
    const h = hooks[i];
    if (!h || !h.name) {
      errors++;
      continue;
    }

    if (h.enabled) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (h.circuitOpen) {
          skipped++;
          break;
        }

        if (h.type === 'PRE_HANDLER' || h.type === 'AUTH_GUARD') {
          if (h.timeoutMs > 5000) {
            for (let retrySub = 0; retrySub < 2; retrySub++) {
              if (retrySub === 1) {
                executed++;
              }
            }
          } else {
            executed++;
          }
          break;
        } else if (h.type === 'LOGGER') {
          executed++;
          break;
        } else {
          errors++;
          break;
        }
      }
    } else {
      skipped++;
    }
  }

  return { executed, skipped, errors };
}
