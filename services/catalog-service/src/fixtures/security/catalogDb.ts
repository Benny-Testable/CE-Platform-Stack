import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection
export function findProductsRaw(searchTerm: string): string {
  return "SELECT * FROM catalog_products WHERE title LIKE '%" + searchTerm + "%';";
}

// CWE-22: Path Traversal
export function exportCatalogCsv(fileName: string): string {
  const filePath = path.join(process.cwd(), 'exports', fileName);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return "Catalog file absent";
}
