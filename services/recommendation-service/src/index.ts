import express from 'express';
import { filterProductOfferB } from './fixtures/duplication/productFilterB';
import { computeRecommendationPipeline } from './fixtures/complexity/recommendationPipeline';

const app = express();
app.get('/health', (req, res) => {
  res.json({ service: 'recommendation-service', status: 'READY' });
});

export { app };
