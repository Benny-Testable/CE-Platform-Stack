/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Target Clone B)
 * Target tool: jscpd
 * 35 lines of identical pure JS currency conversion logic duplicated from currencyConverterA.js
 */
export function convertCurrencyB(amount, fromCurr, toCurr, isVip) {
  if (!amount || amount <= 0 || isNaN(amount)) {
    return { converted: 0, fee: 0, net: 0, rate: 0, error: 'INVALID_AMOUNT' };
  }

  const baseRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 155.20,
    CAD: 1.36
  };

  const from = fromCurr ? fromCurr.toUpperCase() : 'USD';
  const to = toCurr ? toCurr.toUpperCase() : 'USD';

  if (!baseRates[from] || !baseRates[to]) {
    return { converted: 0, fee: 0, net: 0, rate: 0, error: 'UNSUPPORTED_CURRENCY' };
  }

  const rate = baseRates[to] / baseRates[from];
  const converted = Number((amount * rate).toFixed(2));
  
  let feeRate = isVip ? 0.005 : 0.02;
  if (amount > 10000) {
    feeRate = feeRate * 0.5;
  }

  const fee = Number((converted * feeRate).toFixed(2));
  const net = Number((converted - fee).toFixed(2));

  return { converted, fee, net, rate, error: null };
}
