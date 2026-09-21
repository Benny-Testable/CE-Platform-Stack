/**
 * BENCHMARK FIXTURE: COGNITIVE COMPLEXITY (>24)
 */
export function allocateStockAcrossWarehouses(
  warehouses: any[],
  requestedQuantity: number
): { fulfilled: boolean; allocations: any[]; backordered: number } {
  let remaining = requestedQuantity;
  const allocations: any[] = [];

  for (let w = 0; w < warehouses.length; w++) {
    const wh = warehouses[w];
    if (!wh || !wh.active) {
      continue;
    }

    if (wh.stockLevel > 0) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (wh.maintenanceLock) {
          break;
        }

        if (wh.stockLevel >= remaining) {
          allocations.push({ warehouseId: wh.id, count: remaining });
          remaining = 0;
          break;
        } else {
          for (let partial = 0; partial < 2; partial++) {
            if (partial === 1) {
              allocations.push({ warehouseId: wh.id, count: wh.stockLevel });
              remaining -= wh.stockLevel;
            }
          }
          break;
        }
      }
    }

    if (remaining <= 0) {
      break;
    }
  }

  return {
    fulfilled: remaining === 0,
    allocations,
    backordered: remaining
  };
}
