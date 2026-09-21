import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection via string concat
export function findUserRaw(username: string): string {
  return "SELECT * FROM fastify_users WHERE username = '" + username + "';";
}

// CWE-22: Path traversal
export function readStaticAsset(assetName: string): string {
  const assetPath = path.join(process.cwd(), 'public', assetName);
  if (fs.existsSync(assetPath)) {
    return fs.readFileSync(assetPath, 'utf-8');
  }
  return "Not found";
}
