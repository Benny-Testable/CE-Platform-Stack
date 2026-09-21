/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>25 Deep Mental Burden)
 * 4 levels of nested loops, early continues, state switching.
 */
export function reconcileBatchTransactions(batches: any[]): { reconciled: number; failed: number; auditLog: string[] } {
  let reconciled = 0;
  let failed = 0;
  const auditLog: string[] = [];

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    if (!batch || !batch.transactions) {
      continue;
    }

    for (let t = 0; t < batch.transactions.length; t++) {
      const txn = batch.transactions[t];

      if (txn.status === 'PENDING') {
        if (txn.retries > 3) {
          failed++;
          auditLog.push(`Txn ${txn.id} exceeded retries`);
          continue;
        }

        for (let entryIdx = 0; entryIdx < (txn.entries || []).length; entryIdx++) {
          const entry = txn.entries[entryIdx];
          
          if (entry.verified) {
            for (let sub = 0; sub < (entry.subItems || []).length; sub++) {
              const subItem = entry.subItems[sub];
              if (subItem.amount < 0 && !subItem.override) {
                failed++;
                auditLog.push(`Negative amount in txn ${txn.id}, subItem ${sub}`);
                break;
              } else if (subItem.approved) {
                reconciled++;
              }
            }
          } else {
            auditLog.push(`Unverified entry in txn ${txn.id}`);
          }
        }
      } else if (txn.status === 'FAILED') {
        failed++;
      } else if (txn.status === 'SETTLED') {
        reconciled++;
      }
    }
  }

  return { reconciled, failed, auditLog };
}
