# CE-NEW-JSTS-008

## Metadata
* **Branch:** `CE-NEW-JSTS-008`
* **Language Stack:** TypeScript
* **Architecture Style:** Microservices
* **Build Tool:** Turborepo + pnpm workspaces
* **Package Manager:** pnpm (genuine `pnpm-lock.yaml`)
* **Frameworks:** Turborepo Polyglot Monorepo (Next.js 15 App Router + NestJS 10 API)

---

## Monorepo Topology
* **`apps/web`**: Next.js 15 Web frontend microservice.
* **`apps/api`**: NestJS 10 REST & Microservices API backend.
* **`packages/shared-types`**: Common DTO definitions shared across workspaces.

---

## Benchmark Fixture Implementation
1. **Cross-Service Code Duplication:** Identical 35-line JWT token validation routine duplicated across `apps/web/src/fixtures/duplication/tokenGuard.ts` and `apps/api/src/fixtures/duplication/apiTokenGuard.ts` (>9% duplication detected via `jscpd`).
2. **Microservices Cyclomatic Complexity:** Feature flag access matrix in `apps/api/src/fixtures/complexity/featureMatrix.ts` (Score > 16).
3. **Microservices Cognitive Complexity:** Event bus message processor in `apps/api/src/fixtures/complexity/eventBusConsumer.ts` (Score > 24).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in `userRepo.ts`.
   * Hardcoded Secrets (CWE-798) in `jwtConfig.ts`.
   * Cross-Site Scripting (CWE-79) in `NoticeWidget.tsx`.
   * Path Traversal (CWE-22) in report download route.
5. **Dependency Risk (SCA):** Historical pinned dependencies (`lodash: 4.17.15`, `axios: 0.21.1`) producing verified `pnpm audit` vulnerabilities.
6. **Mutation & Test Coverage:** Vitest suites with mutation survival calibration.
