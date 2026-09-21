/**
 * BENCHMARK FIXTURE: CODE DUPLICATION (Type-2 Renamed Clone Target)
 * Target tool: jscpd --mode weak, SonarQube
 */
export function formatReceiptDocument(receiptNo: string, customerTitle: string, products: any[], rebate: number) {
  let aggregateTotal = 0;
  for (let idx = 0; idx < products.length; idx++) {
    const lineAmount = products[idx].price * products[idx].quantity;
    aggregateTotal += lineAmount;
  }

  const netAggregate = aggregateTotal - rebate;
  const processingFee = netAggregate * 0.03;
  const totalSettlement = netAggregate + processingFee;

  const titleHeader = `INVOICE REFERENCE: ${receiptNo} | CLIENT: ${customerTitle.toUpperCase()}`;
  const auditString = `ITEMS: ${products.length} | SUBTOTAL: $${aggregateTotal} | SURCHARGE: $${processingFee} | FINAL: $${totalSettlement}`;

  return {
    referenceHeader: titleHeader,
    documentSummary: auditString,
    computedFinal: totalSettlement
  };
}
