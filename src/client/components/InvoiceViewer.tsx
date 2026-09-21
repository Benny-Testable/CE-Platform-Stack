import React from 'react';

export default function InvoiceViewer() {
  return (
    <div>
      <h2>Invoice Viewer</h2>
      <p>Displays reconciled invoices processed through the backend billing engine.</p>
      <div style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <strong>Invoice #INV-2026-001</strong>
        <p>Total Reconciled: $1,250.50 | Tax Paid: $125.05 | Status: Verified</p>
      </div>
    </div>
  );
}
