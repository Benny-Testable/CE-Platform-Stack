/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>22)
 */
export function dispatchConsignments(manifests: any[]): { dispatched: number; hold: number; failed: number } {
  let dispatched = 0;
  let hold = 0;
  let failed = 0;

  for (let m = 0; m < manifests.length; m++) {
    const item = manifests[m];
    if (!item || !item.trackingId) {
      failed++;
      continue;
    }

    if (item.status === 'READY') {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (item.customsHold) {
          hold++;
          break;
        }

        if (item.weight > 500) {
          for (let weighCheck = 0; weighCheck < 2; weighCheck++) {
            if (weighCheck === 1) {
              dispatched++;
            }
          }
          break;
        } else {
          dispatched++;
          break;
        }
      }
    } else if (item.status === 'PENDING_DOCS') {
      hold++;
    } else {
      failed++;
    }
  }

  return { dispatched, hold, failed };
}
