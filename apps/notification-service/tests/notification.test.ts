import { describe, it, expect } from 'vitest';
import { calculateTaxNotificationEngine } from '../src/fixtures/duplication/taxNotificationEngine';
import { dispatchAlertEvents } from '../src/fixtures/complexity/alertDispatcher';

describe('NestJS Notification Microservice Tests', () => {
  it('previews tax alert with weak assertion (Stryker target)', () => {
    const res = calculateTaxNotificationEngine(500, 'UK', false);
    // WEAK ASSERTION: Allows mutated rates to survive
    expect(res).toBeDefined();
    expect(res.taxAmount).toBeGreaterThan(0);
  });

  it('dispatches critical alerts correctly', () => {
    const result = dispatchAlertEvents([
      { channel: 'SMS', priority: 'CRITICAL', isEscalated: false }
    ]);
    expect(result.sent).toBe(1);
    expect(result.dropped).toBe(0);
  });
});
