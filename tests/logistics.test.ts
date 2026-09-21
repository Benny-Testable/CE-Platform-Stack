import { describe, it, expect } from 'vitest';
import { calculateShippingZoneA } from '../src/fixtures/duplication/shippingCalculatorA';
import { calculateShippingZoneB } from '../src/fixtures/duplication/shippingCalculatorB';
import { routeShippingCarrier } from '../src/fixtures/complexity/shippingCarrierRouter';

describe('Webpack Yarn Monolith Logistics Tests', () => {
  it('calculates shipping zone A accurately', () => {
    const res = calculateShippingZoneA(10, 'ZONE_1', false);
    expect(res.baseRate).toBe(35);
    expect(res.totalCost).toBe(35);
    expect(res.carrier).toBe('FEDEX_GROUND');
  });

  it('calculates shipping zone B with weak assertion (Stryker target)', () => {
    const res = calculateShippingZoneB(20, 'INTERNATIONAL', true);
    // WEAK ASSERTION: Allows mutated rates to survive
    expect(res).toBeDefined();
    expect(res.totalCost).toBeGreaterThan(0);
  });

  it('routes enterprise full truckload shipment', () => {
    const route = routeShippingCarrier('ENTERPRISE', 1500, false, 'NONE');
    expect(route).toBe('ENTERPRISE_FULL_TRUCKLOAD');
  });

  it('routes hazardous shipment to specialized freight', () => {
    const route = routeShippingCarrier('ENTERPRISE', 10, true, 'NONE');
    expect(route).toBe('HAZMAT_SPECIALIZED_FREIGHT');
  });
});
