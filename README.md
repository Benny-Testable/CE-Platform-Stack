# CE-NEW-JSTS-010

## Metadata
* **Branch:** `CE-NEW-JSTS-010`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Microservices
* **Build Tool:** Vite + npm
* **Package Manager:** npm (npm workspaces, genuine `package-lock.json`)
* **Frameworks:** SvelteKit 2+ (Vite) + Node Microservices (Catalog & Recommendations)

---

## Workspace Topology
* **`apps/frontend-svelte`**: SvelteKit 2 SPA frontend microservice built with Vite.
* **`services/catalog-service`**: Product catalog & price management microservice (Express).
* **`services/recommendation-service`**: Collaborative filtering & recommendation ranking microservice.

---

## Benchmark Fixture Implementation
1. **Cross-Service Code Duplication:** Identical 35-line price and category normalization algorithm duplicated across `services/catalog-service/src/fixtures/duplication/productFilterA.ts` and `services/recommendation-service/src/fixtures/duplication/productFilterB.ts` (>10% duplication detected via `jscpd`).
2. **Microservices Cyclomatic Complexity:** Tiered pricing & promotion eligibility matrix in `services/catalog-service/src/fixtures/complexity/rankingMatrix.ts` (Score > 16).
3. **Microservices Cognitive Complexity:** Multi-stage similarity and co-occurrence pipeline in `services/recommendation-service/src/fixtures/complexity/recommendationPipeline.ts` (Score > 24).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in catalog search database queries.
   * Hardcoded Secrets (CWE-798) in catalog service API keys.
   * Command Injection (CWE-78) in diagnostic ping handler.
   * Path Traversal (CWE-22) in catalog export endpoint.
5. **Dependency Risk (SCA):** Historical pinned dependencies (`lodash: 4.17.15`, `axios: 0.21.1`) verified via `npm audit`.
6. **Mutation & Control Flow Coverage:** Vitest suites calibrated for mutation score benchmarking.
