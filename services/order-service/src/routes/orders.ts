import { Router } from 'express';
import { validateOrderPayload } from '../fixtures/duplication/orderValidator';
import { findOrdersByCustomerRaw } from '../fixtures/security/orderRepository';
import { executeOrderWorkflow } from '../fixtures/complexity/orderWorkflow';

const router = Router();

router.post('/create', (req, res) => {
  const validation = validateOrderPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.reasons });
  }

  const workflow = executeOrderWorkflow(req.body.tier || 'STANDARD', req.body.total || 0, false, 'NONE');
  res.json({ message: 'Order created', orderId: 'ORD-' + Date.now(), workflow });
});

router.get('/search', (req, res) => {
  const customer = req.query.customer as string;
  const sql = findOrdersByCustomerRaw(customer);
  res.json({ executedQuery: sql, results: [] });
});

export { router as orderRouter };
