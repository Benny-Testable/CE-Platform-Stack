/**
 * BENCHMARK FIXTURE: SAST STATIC VULNERABILITIES (CWE-798 & CWE-78)
 */
import { exec } from 'child_process';

// INTENTIONAL FIXTURE: Hardcoded credentials
export const PAYMENT_GATEWAY_SECRETS = {
  apiKey: "sk_live_synthetic_payment_token_99882233",
  jwtSecret: "hardcoded_microservice_jwt_secret_payment_service"
};

export function testGatewayConnectivity(endpoint: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // INTENTIONAL FIXTURE: Command injection risk
    exec(`curl -s ${endpoint}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}
