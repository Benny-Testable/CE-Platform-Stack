/**
 * BENCHMARK FIXTURE: DATA FLOW TESTING (All-Defs, All-Uses, Dead Variables)
 * Target tool: SonarQube, ESLint (no-unused-vars), Data flow analyzers
 */
export function analyzeDataFlowLifecycle(initialInput: number, condition: boolean): number {
  // Dead definition: assigned and immediately overwritten before read
  let unreadVariable = initialInput * 10;
  unreadVariable = initialInput + 5; // Overwrites previous definition without use

  let computationalResult = 0; // C-Use
  let predicateSteeringFlag = false; // P-Use

  if (condition) {
    predicateSteeringFlag = true;
    computationalResult = unreadVariable * 2;
  } else {
    computationalResult = unreadVariable - 1;
  }

  return computationalResult;
}
