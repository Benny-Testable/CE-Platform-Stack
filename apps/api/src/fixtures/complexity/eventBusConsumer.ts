/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>24)
 */
export function processEventBusBatch(batch: any[]): { success: number; deadletter: number; skipped: number } {
  let success = 0;
  let deadletter = 0;
  let skipped = 0;

  for (let i = 0; i < batch.length; i++) {
    const ev = batch[i];
    if (!ev || !ev.topic) {
      deadletter++;
      continue;
    }

    if (ev.topic.startsWith('TRANSACTION_')) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (ev.isCorrupt) {
          deadletter++;
          break;
        }

        if (ev.payload && ev.payload.amount > 1000) {
          for (let check = 0; check < 2; check++) {
            if (check === 1) {
              success++;
            }
          }
          break;
        } else {
          success++;
          break;
        }
      }
    } else if (ev.topic === 'HEARTBEAT') {
      skipped++;
    } else {
      deadletter++;
    }
  }

  return { success, deadletter, skipped };
}
