# CE-NEW-JSTS-009

## Metadata
* **Branch:** `CE-NEW-JSTS-009`
* **Language Stack:** Pure JavaScript (No TypeScript)
* **Architecture Style:** Monolith
* **Build Tool:** Vite 5.3+ + bun
* **Package Manager:** bun (genuine `bun.lock` / `bun.lockb`)
* **Frameworks:** Vue 3 SPA + Node.js (Koa.js) Backend

---

## Monolith Structure
* **`src/client`**: Vue 3 SPA bundled via Vite with `@vitejs/plugin-vue`.
* **`src/server`**: Lightweight Koa.js HTTP API server running on Bun / Node.
* **`src/fixtures`**: Calibrated Pure JavaScript benchmark fixture suite.

---

## Benchmark Fixture Implementation
1. **Code Duplication:** 35-line Type-1 currency exchange and fee settlement calculation duplicated across `src/fixtures/duplication/currencyConverterA.js` and `src/fixtures/duplication/currencyConverterB.js` (>10% duplication detected via `jscpd`).
2. **Cyclomatic Complexity:** Multi-tiered customer rebate calculation engine in `src/fixtures/complexity/rebateEngine.js` (Score > 16).
3. **Cognitive Complexity:** Nested Koa middleware dispatcher in `src/fixtures/complexity/koaPipeline.js` (Score > 22).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in Koa customer lookup.
   * Command Injection (CWE-78) in diagnostic ping handler.
   * Hardcoded Secrets (CWE-798) in auth config.
   * Path Traversal (CWE-22) in static file download route.
5. **Dependency Risk (SCA):** Historical pinned dependencies (`lodash: 4.17.15`, `axios: 0.21.1`).
6. **Mutation & Test Coverage:** Bun unit test suite (`bun test`) testing business logic with calibrated weak assertions.
