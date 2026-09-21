# CE-NEW-JSTS-006

## Metadata
* **Branch:** `CE-NEW-JSTS-006`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Microservices
* **Build Tool:** Rspack (Rust) + pnpm
* **Package Manager:** pnpm (genuine `pnpm-lock.yaml`, pnpm workspaces)
* **Frameworks:** React 18+ (Rspack SPA) + Node Microservices (Fastify HTTP Services)

---

## Microservices Topology
* **`apps/admin-dashboard`**: React 18 Admin portal bundled with ultra-fast Rust Rspack.
* **`services/auth-service`**: Microservice providing RBAC authentication and session verification.
* **`services/inventory-service`**: Microservice managing warehouse stock allocation and catalog indexing.

---

## Benchmark Fixture Implementation
1. **Cross-Service Duplication:** Identical 35-line RBAC token validation routine duplicated across `services/auth-service` and `services/inventory-service` (`roleValidator.ts` vs `inventoryRoleValidator.ts`).
2. **Microservices Cyclomatic Complexity:** Policy decision engine in `services/auth-service/src/fixtures/complexity/policyEngine.ts` (Score > 16).
3. **Microservices Cognitive Complexity:** Multi-warehouse failover stock allocator in `services/inventory-service/src/fixtures/complexity/stockAllocator.ts` (Score > 24).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in inventory database query.
   * Hardcoded Secrets (CWE-798) in auth service.
   * Command Injection (CWE-78) in admin ping endpoint.
   * Path Traversal (CWE-22) in warehouse manifest export.
5. **Dependency Risk (SCA):** Historical pinned packages with verified CVEs (`lodash: 4.17.15`, `axios: 0.21.1`).
6. **Mutation & Test Coverage:** Vitest suites with mutation survival calibration.
