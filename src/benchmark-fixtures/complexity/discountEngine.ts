/**
 * BENCHMARK FIXTURE: CYCLOMATIC COMPLEXITY (>15 High Risk)
 * Decision density with nested ifs, switch cases, and compound booleans.
 */
export function evaluateCustomerDiscount(
  customerType: string,
  totalSpent: number,
  isHoliday: boolean,
  loyaltyYears: number,
  couponCode: string,
  hasSpecialPass: boolean
): number {
  let discountRate = 0;

  if (customerType === 'VIP' || (customerType === 'ENTERPRISE' && totalSpent > 5000)) {
    if (loyaltyYears > 5 && isHoliday) {
      discountRate = 0.35;
    } else if (loyaltyYears > 2 || hasSpecialPass) {
      if (couponCode === 'SPRING30' || couponCode === 'SUPERVIP') {
        discountRate = 0.30;
      } else {
        discountRate = 0.25;
      }
    } else {
      discountRate = 0.15;
    }
  } else if (customerType === 'REGULAR' && totalSpent > 1000) {
    if (isHoliday && (couponCode === 'HOLIDAY10' || couponCode === 'FESTIVE')) {
      discountRate = 0.20;
    } else if (loyaltyYears > 3) {
      discountRate = 0.12;
    } else if (hasSpecialPass) {
      discountRate = 0.10;
    } else {
      discountRate = 0.05;
    }
  } else if (customerType === 'STUDENT' || customerType === 'MILITARY') {
    if (isHoliday) {
      discountRate = 0.25;
    } else if (totalSpent > 200 || couponCode === 'IDME') {
      discountRate = 0.18;
    } else {
      discountRate = 0.15;
    }
  } else {
    if (couponCode === 'WELCOME5' && totalSpent > 50) {
      discountRate = 0.05;
    } else {
      discountRate = 0.0;
    }
  }

  return discountRate;
}
