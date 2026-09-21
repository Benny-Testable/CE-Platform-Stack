'use server';

import { calculateInvoiceB } from '@/fixtures/duplication/invoiceProcessorB';

export async function processBillingAction(formData: FormData) {
  const amount = Number(formData.get('amount') || 0);
  const plan = String(formData.get('plan') || 'STANDARD');
  
  const result = calculateInvoiceB(
    [{ sku: 'SKU-SUB', price: amount, quantity: 1 }],
    0.08,
    'NONE'
  );
  
  return {
    success: true,
    total: result.finalTotal,
    plan
  };
}
