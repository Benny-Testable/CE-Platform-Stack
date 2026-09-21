/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>16)
 */
export function routeShippingCarrier(
  customerTier: string,
  weightKg: number,
  isHazardous: boolean,
  customsCode: string
): string {
  let routing = 'DEFAULT_POSTAL';

  if (isHazardous) {
    return 'HAZMAT_SPECIALIZED_FREIGHT';
  }

  if (customerTier === 'ENTERPRISE') {
    if (weightKg > 1000) {
      routing = 'ENTERPRISE_FULL_TRUCKLOAD';
    } else if (weightKg > 200) {
      routing = 'ENTERPRISE_LESS_THAN_TRUCKLOAD';
    } else {
      routing = 'ENTERPRISE_PRIORITY_COURIER';
    }
  } else if (customerTier === 'BUSINESS') {
    if (customsCode === 'EXPORT_CLEAR') {
      routing = 'COMMERCIAL_INTERNATIONAL_AIR';
    } else if (weightKg > 100) {
      routing = 'COMMERCIAL_PALLET_LINE';
    } else {
      routing = 'COMMERCIAL_PARCEL_EXPEDITED';
    }
  } else if (customerTier === 'RESIDENTIAL') {
    if (weightKg > 50) {
      routing = 'TWO_PERSON_HOME_DELIVERY';
    } else {
      routing = 'STANDARD_CURBSIDE_DROP';
    }
  } else {
    routing = 'UNCLASSIFIED_CARRIER_DISPATCH';
  }

  return routing;
}
