/**
 * BENCHMARK FIXTURE: SAST HARDCODED CREDENTIALS (CWE-798)
 * Target tool: Gitleaks, Trufflehog, Semgrep, SonarQube
 */
export const SYNTHETIC_AWS_CREDENTIALS = {
  // Synthetic key pattern for scanner trigger
  awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE_SYNTHETIC",
  awsSecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY_TEST",
  jwtSecretKey: "super_secret_production_master_token_do_not_share_12345"
};
