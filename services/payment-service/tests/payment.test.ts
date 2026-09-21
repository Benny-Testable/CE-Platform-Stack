import { describe, it, expect } from 'vitest';
import { validatePaymentPayload } from '../src/fixtures/duplication/paymentValidator';
import { routePaymentTransaction } from '../src/fixtures/complexity/paymentRouter';

describe('Payment Microservice Tests', () => {
  it('exercises payment validation with weak assertion (Stryker target)', () => {
    const res = validatePaymentPayload({ orderId: 'ORD-9', amount: 50, currency: 'USD' });
    // WEAK ASSERTION: Allows arithmetic/rate mutants to survive
    expect(res).toBeDefined();
    expect(res.valid).toBe(true);
  });

  it('routes standard stripe transaction', () => {
    const result = routePaymentTransaction([{ provider: 'STRIPE', attempts: 1, amount: 200 }]);
    expect(result.success).toBe(true);
  });
});
