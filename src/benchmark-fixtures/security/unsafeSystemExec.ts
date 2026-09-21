/**
 * BENCHMARK FIXTURE: SAST STATIC VULNERABILITY (CWE-78 Command Injection)
 * Target tool: Semgrep, ESLint-plugin-security
 */
import { exec } from 'child_process';

export function runDiagnosticPing(targetHost: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // INTENTIONAL FIXTURE: Command concatenation with unvalidated user input
    exec("ping -c 1 " + targetHost, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}
