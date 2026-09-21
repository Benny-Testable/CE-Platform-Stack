import { describe, it, expect } from 'vitest';
import { validateOrderPayload } from '../src/fixtures/duplication/orderValidator';
import { executeOrderWorkflow } from '../src/fixtures/complexity/orderWorkflow';

describe('Order Service Tests (Calibrated Coverage)', () => {
  it('validates a correct payload', () => {
    const res = validateOrderPayload({ orderId: 'ORD-1', amount: 100, currency: 'USD' });
    expect(res.valid).toBe(true);
    expect(res.normalizedAmount).toBe(100);
  });

  it('rejects an invalid payload', () => {
    const res = validateOrderPayload({ orderId: '', amount: -5, currency: 'XYZ' });
    expect(res.valid).toBe(false);
    expect(res.reasons.length).toBeGreaterThanOrEqual(2);
  });

  it('executes enterprise workflow path', () => {
    const route = executeOrderWorkflow('ENTERPRISE', 60000, false, 'NONE');
    expect(route).toBe('HIGH_VALUE_MANUAL_REVIEW');
  });
});
