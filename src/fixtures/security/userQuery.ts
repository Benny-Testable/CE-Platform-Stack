/**
 * BENCHMARK FIXTURE: SAST STATIC VULNERABILITIES (CWE-89, CWE-22, CWE-798)
 */
import path from 'path';
import fs from 'fs';

// CWE-798: Hardcoded secret key
export const STRIPE_CONFIG = {
  webhookSecret: "whsec_synthetic_live_token_7733441199",
  masterSigningKey: "super_secret_jwt_key_nextjs_fullstack"
};

// CWE-89: SQL Injection via direct concatenation
export function buildUserSearchQuery(username: string): string {
  return "SELECT id, email, role FROM users WHERE username = '" + username + "' AND active = 1;";
}

// CWE-22: Path Traversal in document retrieval
export function readGeneratedReport(filename: string): string {
  const filePath = path.join(process.cwd(), 'reports', filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return "Report missing";
}
