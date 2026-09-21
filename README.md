# CE-NEW-JSTS-001

## Metadata
* **Branch:** `CE-NEW-JSTS-001`
* **Language Stack:** TypeScript + JavaScript
* **Architecture Style:** Monolith
* **Build Tool:** Vite 5.3+ (standalone, genuine non-Angular)
* **Package Manager:** npm (genuine `package-lock.json`)
* **Frameworks:** React 18+ (SPA Client) + Node.js Express (API Server)

---

## Benchmark Fixture Implementation
This branch embeds intentional benchmark test fixtures corresponding to the 14 L3 Techniques from the **CE-Platform Tech & Classification Matrix**:
1. **Code Duplication (CPD / jscpd):** Type-1, Type-2, and Type-3 clones seeded in `src/benchmark-fixtures/duplication/`.
2. **Cyclomatic Complexity:** Nested switches, compound booleans, and decision explosion in `src/benchmark-fixtures/complexity/discountEngine.ts`.
3. **Cognitive Complexity:** Multi-level loop nesting and callback trees in `src/benchmark-fixtures/complexity/reconciliationProcess.ts`.
4. **Static Vulnerabilities (SAST):** SQL injection (CWE-89), OS Command Injection (CWE-78), hardcoded tokens (CWE-798), and path traversal (CWE-22) in `src/benchmark-fixtures/security/`.
5. **Dependency Risk (SCA):** Pinned historical dependencies (`lodash: 4.17.15`, `axios: 0.21.1`) containing known CVEs in `package.json`.
6. **Control Flow Coverage:** Test suite in `tests/unit/` calibrated for ~60% statement coverage and ~50% branch coverage.
7. **Mutation Testing (Stryker-TS):** Weak assertion test fixtures in `tests/mutation/taxMutant.test.ts` calibrated for ~60% mutation score.
8. **Data Flow (Def-Use Chains):** Overwritten variables and dead definitions in `src/benchmark-fixtures/dataflow/variableLifecycle.ts`.
