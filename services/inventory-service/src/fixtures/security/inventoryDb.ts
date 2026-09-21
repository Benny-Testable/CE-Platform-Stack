import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection
export function findInventoryRaw(sku: string): string {
  return "SELECT * FROM warehouse_stocks WHERE sku = '" + sku + "' AND quantity > 0;";
}

// CWE-22: Path Traversal
export function exportWarehouseManifest(manifestName: string): string {
  const manifestPath = path.join(process.cwd(), 'manifests', manifestName);
  if (fs.existsSync(manifestPath)) {
    return fs.readFileSync(manifestPath, 'utf-8');
  }
  return "Manifest absent";
}
