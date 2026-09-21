import Fastify from 'fastify';
import { validateUserRoleB } from './fixtures/duplication/inventoryRoleValidator';
import { allocateStockAcrossWarehouses } from './fixtures/complexity/stockAllocator';
import { findInventoryRaw } from './fixtures/security/inventoryDb';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => {
  return { service: 'inventory-service', status: 'ACTIVE' };
});

export { fastify };
