import { describe, it, expect } from 'vitest';
import { validateUserRoleB } from '../src/fixtures/duplication/inventoryRoleValidator';
import { allocateStockAcrossWarehouses } from '../src/fixtures/complexity/stockAllocator';

describe('Inventory Service Tests', () => {
  it('validates role with weak assertion (mutation testing target)', () => {
    const res = validateUserRoleB('token-synthetic-123', ['USER'], Date.now());
    // WEAK ASSERTION: Allows mutated role logic to survive
    expect(res).toBeDefined();
    expect(res.authorized).toBe(true);
  });

  it('allocates stock across single warehouse', () => {
    const res = allocateStockAcrossWarehouses([{ id: 'WH-1', active: true, stockLevel: 100 }], 50);
    expect(res.fulfilled).toBe(true);
    expect(res.allocations.length).toBe(1);
    expect(res.backordered).toBe(0);
  });
});
