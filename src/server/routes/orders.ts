import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json([
    { id: 'ORD-101', customer: 'Acme Corp', amount: 1250.5, status: 'COMPLETED' },
    { id: 'ORD-102', customer: 'Globex Inc', amount: 480.0, status: 'PENDING' }
  ]);
});

export { router as orderRoutes };
