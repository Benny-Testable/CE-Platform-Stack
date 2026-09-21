import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection via concatenation
export function findConsignmentsRaw(customerName: string): string {
  return "SELECT * FROM consignments WHERE shipper = '" + customerName + "' ORDER BY date DESC;";
}

// CWE-22: Path Traversal
export function exportBillOfLading(bolFileName: string): string {
  const bolPath = path.join(process.cwd(), 'bol_archive', bolFileName);
  if (fs.existsSync(bolPath)) {
    return fs.readFileSync(bolPath, 'utf-8');
  }
  return "Document not found";
}
