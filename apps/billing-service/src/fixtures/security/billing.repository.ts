import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection via string interpolation
export function findInvoicesByCustomerRaw(customerId: string): string {
  return "SELECT * FROM billing_invoices WHERE customer_id = '" + customerId + "' AND active = 1;";
}

// CWE-22: Path Traversal
export function exportTaxAuditReport(fileName: string): string {
  const auditPath = path.join(__dirname, '..', '..', 'reports', fileName);
  if (fs.existsSync(auditPath)) {
    return fs.readFileSync(auditPath, 'utf-8');
  }
  return "Not found";
}
