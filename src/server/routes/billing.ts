import { Router, Request, Response } from 'express';
import { calculateTaxServiceA } from '../../benchmark-fixtures/duplication/taxCalculationServiceA';

const router = Router();

router.post('/calculate', (req: Request, res: Response) => {
  const { subtotal, stateCode, isExempt } = req.body;
  const result = calculateTaxServiceA(Number(subtotal) || 0, stateCode || 'NY', Boolean(isExempt));
  res.json(result);
});

export { router as billingRoutes };
