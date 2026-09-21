import express from 'express';
import cors from 'cors';
import { orderRoutes } from './routes/orders';
import { billingRoutes } from './routes/billing';
import { fileRoutes } from './routes/files';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/files', fileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'HEALTHY', branch: 'CE-NEW-JSTS-001', stack: 'React 18 Vite + Express' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`CE-NEW-JSTS-001 Monolith server running at http://localhost:${port}`);
  });
}

export { app };
