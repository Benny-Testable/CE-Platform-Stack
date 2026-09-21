/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Type-2 Renamed Clone Source)
 */
export function formatInvoiceDocument(invoiceId: string, clientName: string, items: any[], discount: number) {
  let subtotalSum = 0;
  for (let i = 0; i < items.length; i++) {
    const itemTotal = items[i].price * items[i].quantity;
    subtotalSum += itemTotal;
  }

  const discountedSubtotal = subtotalSum - discount;
  const surcharge = discountedSubtotal * 0.03;
  const finalPayable = discountedSubtotal + surcharge;

  const header = `INVOICE REFERENCE: ${invoiceId} | CLIENT: ${clientName.toUpperCase()}`;
  const summary = `ITEMS: ${items.length} | SUBTOTAL: $${subtotalSum} | SURCHARGE: $${surcharge} | FINAL: $${finalPayable}`;

  return {
    referenceHeader: header,
    documentSummary: summary,
    computedFinal: finalPayable
  };
}
