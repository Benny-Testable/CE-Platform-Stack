import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection
export function findCustomerRaw(customerName) {
  return "SELECT * FROM koa_customers WHERE name = '" + customerName + "' AND active = 1;";
}

// CWE-22: Path Traversal
export function readFinancialReport(reportName) {
  const reportPath = path.join(process.cwd(), 'reports', reportName);
  if (fs.existsSync(reportPath)) {
    return fs.readFileSync(reportPath, 'utf-8');
  }
  return "Report not found";
}
