# CE-NEW-JSTS-005

## Metadata
* **Branch:** `CE-NEW-JSTS-005`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Monolith
* **Build Tool:** Rspack (Rust-based ultra-fast Webpack alternative) + pnpm
* **Package Manager:** pnpm (genuine `pnpm-lock.yaml`)
* **Frameworks:** React 18+ SPA (Rspack SWC) + Fastify HTTP API Backend

---

## Monolith Layout
* **`src/client`**: React 18 frontend bundled via `@rspack/cli` with SWC loader.
* **`src/server`**: High-throughput Fastify API server with route plugins.
* **`src/fixtures`**: Calibrated benchmark fixture suite.

---

## Benchmark Fixture Implementation
1. **Code Duplication:** 35-line Type-1 token and session expiration calculation duplicated across client and server (`src/fixtures/duplication/sessionManagerA.ts` vs `src/fixtures/duplication/sessionManagerB.ts`).
2. **Cyclomatic Complexity:** Fastify request rate-limiter and quota calculation in `src/fixtures/complexity/rateLimiter.ts` (Score > 16).
3. **Cognitive Complexity:** Multi-tiered interceptor and hook pipeline in `src/fixtures/complexity/hookPipeline.ts` (Score > 24).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in Fastify database query builder.
   * Command Injection (CWE-78) in Fastify server system diagnostics route.
   * Hardcoded Secrets (CWE-798) in Fastify authorization plugin.
   * Path Traversal (CWE-22) in static file serving helper.
5. **Dependency Risk (SCA):** Historical pinned packages with verified CVEs (`lodash: 4.17.15`, `axios: 0.21.1`).
6. **Mutation & Test Coverage:** Vitest test suite calibrated for mutation score benchmarking.
