# CE-NEW-JSTS-007

## Metadata
* **Branch:** `CE-NEW-JSTS-007`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Monolith
* **Build Tool:** Webpack 5 + yarn Classic (v1)
* **Package Manager:** yarn v1 (genuine `yarn.lock`)
* **Frameworks:** React 18+ SPA (Webpack ts-loader) + Express API Backend

---

## Monolith Structure
* **`src/client`**: React 18 frontend bundled via Webpack 5.
* **`src/server`**: Node.js Express REST API.
* **`src/fixtures`**: Calibrated benchmark fixture suite.

---

## Benchmark Fixture Implementation
1. **Code Duplication:** 35-line Type-1 shipping zone rate computation duplicated across `src/fixtures/duplication/shippingCalculatorA.ts` and `src/fixtures/duplication/shippingCalculatorB.ts` (>9% duplication detected via `jscpd`).
2. **Cyclomatic Complexity:** Carrier routing decision matrix in `src/fixtures/complexity/shippingCarrierRouter.ts` (Score > 16).
3. **Cognitive Complexity:** Multi-stage consignment dispatch state machine in `src/fixtures/complexity/manifestDispatcher.ts` (Score > 22).
4. **Security SAST Vulnerabilities:**
   * SQL Injection (CWE-89) in consignment search query.
   * Command Injection (CWE-78) in logistics diagnostic ping route.
   * Hardcoded Secret (CWE-798) in carrier API integration credentials.
   * Path Traversal (CWE-22) in bill-of-lading download endpoint.
5. **Dependency Risk (SCA):** Historical pinned packages with verified CVEs (`lodash: 4.17.15`, `axios: 0.21.1`) audited via `yarn audit`.
6. **Mutation & Control Flow Coverage:** Vitest suites with mutation survival calibration.
