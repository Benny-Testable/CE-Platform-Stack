# CE-NEW-JSTS-003

## Metadata
* **Branch:** `CE-NEW-JSTS-003`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Monolith
* **Build Tool:** Turbopack + npm
* **Package Manager:** npm (genuine `package-lock.json`)
* **Frameworks:** Next.js 15 (App Router / SSR) Fullstack Monolith

---

## Benchmark Fixture Implementation
1. **Code Duplication:** 36-line Type-1 duplicate invoice tax/settlement routine in `src/fixtures/duplication/invoiceProcessorA.ts` and `src/fixtures/duplication/invoiceProcessorB.ts` (>8% duplication detected via `jscpd`).
2. **Cyclomatic Complexity:** Subscription workflow entitlement decision matrix in `src/fixtures/complexity/subscriptionWorkflow.ts` (Score > 16).
3. **Cognitive Complexity:** Webhook event retry and nested dispatch tree in `src/fixtures/complexity/webhookDispatcher.ts` (Score > 22).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in dynamic customer query.
   * Cross-Site Scripting (CWE-79) via raw HTML injection in `src/components/RichComment.tsx`.
   * Hardcoded Secrets (CWE-798) in payment webhook handler.
   * Path Traversal (CWE-22) in download API route.
5. **Dependency Risk (SCA):** Pinned legacy dependencies (`lodash: 4.17.15`, `axios: 0.21.1`) producing verified `npm audit` vulnerabilities.
6. **Mutation & Test Coverage:** Vitest suites testing Server Actions & calculation services with calibrated weak assertions.
