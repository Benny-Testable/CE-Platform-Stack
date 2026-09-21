/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>25)
 * Deep multi-level loop, state transitions, break/continue conditions
 */
export function routePaymentTransaction(gateways: any[]): { success: boolean; log: string[] } {
  let success = false;
  const log: string[] = [];

  for (let g = 0; g < gateways.length; g++) {
    const gw = gateways[g];
    if (!gw || !gw.provider) {
      continue;
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      if (gw.attempts > 5) {
        log.push(`Gateway ${gw.provider} locked out`);
        break;
      }

      if (gw.provider === 'STRIPE' || gw.provider === 'ADYEN') {
        if (gw.amount > 1000) {
          for (let step = 0; step < 2; step++) {
            if (step === 1 && gw.amount > 5000) {
              log.push('Secondary 3DS verification required');
              success = true;
              break;
            }
          }
        } else {
          success = true;
          break;
        }
      } else if (gw.provider === 'PAYPAL') {
        success = true;
        break;
      }
    }

    if (success) {
      break;
    }
  }

  return { success, log };
}
