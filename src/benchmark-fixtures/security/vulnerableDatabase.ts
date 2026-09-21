/**
 * BENCHMARK FIXTURE: SAST STATIC VULNERABILITY (CWE-89 SQL Injection)
 * Target tool: Semgrep, Bandit, SonarQube SAST, CodeQL
 */
export function buildVulnerableUserQuery(userInputEmail: string): string {
  // INTENTIONAL FIXTURE: Raw unescaped string concatenation
  const query = "SELECT id, email, password_hash, role FROM users WHERE email = '" + userInputEmail + "' AND is_active = 1;";
  return query;
}
