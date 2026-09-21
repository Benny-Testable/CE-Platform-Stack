/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>22)
 * Nested loop logic, retry state machine, break conditions
 */
export function dispatchWebhookEvents(events: any[]): { processed: number; retried: number; failed: number } {
  let processed = 0;
  let retried = 0;
  let failed = 0;

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    if (!ev || !ev.type) {
      failed++;
      continue;
    }

    if (ev.type.startsWith('PAYMENT_')) {
      for (let attempt = 0; attempt < 4; attempt++) {
        if (ev.fatalError) {
          failed++;
          break;
        }

        if (attempt > 0) {
          retried++;
        }

        if (ev.status === 'CONFIRMED' || attempt === 3) {
          if (ev.amount > 10000) {
            for (let auditStep = 0; auditStep < 2; auditStep++) {
              if (auditStep === 1) {
                processed++;
              }
            }
          } else {
            processed++;
          }
          break;
        }
      }
    } else if (ev.type.startsWith('USER_')) {
      if (ev.immediate) {
        processed++;
      } else {
        retried++;
      }
    } else {
      failed++;
    }
  }

  return { processed, retried, failed };
}
