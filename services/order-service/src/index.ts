import express from 'express';
import cors from 'cors';
import { orderRouter } from './routes/orders';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRouter);

app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'ONLINE', port });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Order Service listening on http://localhost:${port}`);
  });
}

export { app };
