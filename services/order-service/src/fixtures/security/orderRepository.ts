/**
 * BENCHMARK FIXTURE: SAST STATIC VULNERABILITIES (CWE-89 & CWE-22)
 */
import path from 'path';
import fs from 'fs';

export function findOrdersByCustomerRaw(customerInput: string): string {
  // INTENTIONAL SAST FIXTURE: Raw SQL concatenation
  return "SELECT * FROM orders WHERE customer_name = '" + customerInput + "' ORDER BY created_at DESC;";
}

export function exportOrderReceipt(filename: string): string {
  // INTENTIONAL SAST FIXTURE: Unvalidated path traversal
  const target = path.join(__dirname, '..', '..', 'receipts', filename);
  if (fs.existsSync(target)) {
    return fs.readFileSync(target, 'utf-8');
  }
  return "Not found";
}
