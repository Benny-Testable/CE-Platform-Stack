# CE-NEW-JSTS-004

## Metadata
* **Branch:** `CE-NEW-JSTS-004`
* **Language Stack:** TypeScript
* **Architecture Style:** Microservices
* **Build Tool:** tsup / SWC + pnpm
* **Package Manager:** pnpm (pnpm workspaces, genuine `pnpm-lock.yaml`)
* **Frameworks:** NestJS 10+ Enterprise Microservices (TCP Transport & REST Gateway)

---

## Workspace Topology
* **`apps/api-gateway`**: NestJS 10 REST Gateway communicating with microservices over TCP.
* **`apps/billing-service`**: NestJS microservice handling invoice generation, tax settlement, and payment routing.
* **`apps/notification-service`**: NestJS microservice handling customer alerts and digest dispatching.

---

## Benchmark Fixture Implementation
1. **Cross-Service Code Duplication:** Identical 34-line tax calculation logic shared between `apps/billing-service/src/fixtures/duplication/taxRateEngine.ts` and `apps/notification-service/src/fixtures/duplication/taxNotificationEngine.ts` (>8% duplication detected by `jscpd`).
2. **Microservices Cyclomatic Complexity:** Multi-tier enterprise tax and discount exemption workflow in `apps/billing-service/src/fixtures/complexity/taxWorkflow.ts` (Score > 16).
3. **Microservices Cognitive Complexity:** Nested retry and event dispatch tree in `apps/notification-service/src/fixtures/complexity/alertDispatcher.ts` (Score > 22).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in `billing.repository.ts`.
   * Hardcoded Secrets (CWE-798) in `gateway.auth.ts`.
   * Command Injection (CWE-78) in `diagnostics.controller.ts`.
   * Path Traversal (CWE-22) in invoice export endpoint.
5. **Dependency Risk (SCA):** Historical package versions pinned with known CVEs (`lodash: 4.17.15`, `jsonwebtoken: 8.5.1`).
6. **Mutation & Control Flow Coverage:** Vitest suites with unit assertions calibrated for mutation score benchmarking.
