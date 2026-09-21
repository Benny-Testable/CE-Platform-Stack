/**
 * BENCHMARK FIXTURE: CROSS-SERVICE CODE DUPLICATION (Source Clone)
 * Target tool: jscpd across microservices
 * Identical 35-line validation routine copy-pasted in payment-service
 */
export function validateOrderPayload(payload: any): { valid: boolean; reasons: string[]; normalizedAmount: number } {
  const reasons: string[] = [];

  if (!payload) {
    return { valid: false, reasons: ['Payload is required'], normalizedAmount: 0 };
  }

  if (!payload.orderId || typeof payload.orderId !== 'string' || payload.orderId.trim().length === 0) {
    reasons.push('Invalid orderId: must be a non-empty string');
  }

  if (typeof payload.amount !== 'number' || isNaN(payload.amount) || payload.amount <= 0) {
    reasons.push('Invalid amount: must be positive number');
  }

  if (!payload.currency || !['USD', 'EUR', 'GBP', 'CAD'].includes(payload.currency.toUpperCase())) {
    reasons.push('Invalid currency: unsupported currency code');
  }

  let normalizedAmount = Number(payload.amount || 0);
  if (payload.applyFee) {
    normalizedAmount = Number((normalizedAmount * 1.025).toFixed(2));
  }

  return {
    valid: reasons.length === 0,
    reasons,
    normalizedAmount
  };
}
