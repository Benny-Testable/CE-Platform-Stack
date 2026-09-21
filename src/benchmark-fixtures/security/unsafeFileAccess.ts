/**
 * BENCHMARK FIXTURE: SAST PATH TRAVERSAL (CWE-22)
 * Target tool: Semgrep, CodeQL, ESLint-plugin-security
 */
import fs from 'fs';
import path from 'path';

export function readReportFile(userSuppliedFilename: string): string {
  // INTENTIONAL FIXTURE: Path traversal via unvalidated path join
  const targetPath = path.join(__dirname, '..', '..', 'reports', userSuppliedFilename);
  if (fs.existsSync(targetPath)) {
    return fs.readFileSync(targetPath, 'utf8');
  }
  return "File not found";
}
