/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Source Clone A)
 * Target tool: jscpd
 * 36 lines of identical invoice settlement logic duplicated in invoiceProcessorB.ts
 */
export interface InvoiceItem {
  sku: string;
  price: number;
  quantity: number;
}

export function calculateInvoiceA(
  items: InvoiceItem[],
  taxRate: number,
  couponCode: string
): { subtotal: number; discount: number; taxAmount: number; finalTotal: number; lineCount: number } {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it && it.price > 0 && it.quantity > 0) {
      subtotal += it.price * it.quantity;
    }
  }

  let discount = 0;
  if (couponCode === 'SAVE10' && subtotal > 100) {
    discount = subtotal * 0.10;
  } else if (couponCode === 'SAVE20' && subtotal > 250) {
    discount = subtotal * 0.20;
  } else if (couponCode === 'FLAT50' && subtotal > 500) {
    discount = 50.0;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Number((taxableAmount * taxRate).toFixed(2));
  const finalTotal = Number((taxableAmount + taxAmount).toFixed(2));

  return {
    subtotal,
    discount,
    taxAmount,
    finalTotal,
    lineCount: items.length
  };
}
