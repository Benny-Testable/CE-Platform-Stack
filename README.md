# CE-NEW-JSTS-002

## Metadata
* **Branch:** `CE-NEW-JSTS-002`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Microservices
* **Build Tool:** Vite 5.3+ (standalone) + tsup/Node
* **Package Manager:** pnpm (genuine `pnpm-lock.yaml`, pnpm workspaces)
* **Frameworks:** React 18+ (Vite SPA) + Node Microservices (gRPC / HTTP API)

---

## Services Topology
* **`apps/frontend-client`**: React 18 SPA built with Vite.
* **`services/order-service`**: HTTP REST API gateway & order management service (port 3001).
* **`services/payment-service`**: High-performance gRPC payment transaction service (`proto/payment.proto`).

---

## Benchmark Fixture Implementation
1. **Cross-Service Code Duplication:** Exact Type-1 clone duplicated across microservice boundaries (`services/order-service/src/fixtures/duplication/orderValidator.ts` vs `services/payment-service/src/fixtures/duplication/paymentValidator.ts`).
2. **Microservices Cyclomatic Complexity:** Order state transition engine in `services/order-service/src/fixtures/complexity/orderWorkflow.ts` (Score > 15).
3. **Microservices Cognitive Complexity:** Saga retry and transaction reconciliation loop in `services/payment-service/src/fixtures/complexity/paymentRouter.ts` (Score > 25).
4. **Security SAST Vulnerabilities:**
   * SQLi (CWE-89) in order repository.
   * Hardcoded token / JWT secret (CWE-798) in payment auth.
   * Command injection (CWE-78) in diagnostic ping endpoint.
   * Path traversal (CWE-22) in invoice export endpoint.
5. **Dependency Risk (SCA):** Historical dependency pinning with known CVEs in `services/payment-service/package.json` (`lodash: 4.17.15`, `jsonwebtoken: 8.5.1`).
6. **Mutation & Control Flow Coverage:** Vitest suites calibrated for ~65% statement coverage and mutation test survival.
