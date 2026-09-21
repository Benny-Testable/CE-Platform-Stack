/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Target Clone B)
 * Target tool: jscpd
 * 35 lines of identical shipping calculation duplicated from shippingCalculatorA.ts
 */
export function calculateShippingZoneB(
  weightKg: number,
  zoneCode: string,
  isExpress: boolean
): { baseRate: number; surcharge: number; totalCost: number; carrier: string } {
  if (weightKg <= 0) {
    return { baseRate: 0, surcharge: 0, totalCost: 0, carrier: 'INVALID_WEIGHT' };
  }

  let ratePerKg = 4.50;
  const zone = zoneCode ? zoneCode.toUpperCase() : 'DOMESTIC';

  if (zone === 'ZONE_1') {
    ratePerKg = 3.50;
  } else if (zone === 'ZONE_2') {
    ratePerKg = 5.25;
  } else if (zone === 'ZONE_3') {
    ratePerKg = 7.80;
  } else if (zone === 'INTERNATIONAL') {
    ratePerKg = 14.50;
  }

  let baseRate = Number((weightKg * ratePerKg).toFixed(2));
  let surcharge = 0;

  if (isExpress) {
    surcharge = Number((baseRate * 0.40).toFixed(2));
  }

  if (weightKg > 30) {
    surcharge += 25.00;
  }

  const totalCost = Number((baseRate + surcharge).toFixed(2));
  const carrier = isExpress ? 'DHL_EXPRESS' : 'FEDEX_GROUND';

  return { baseRate, surcharge, totalCost, carrier };
}
