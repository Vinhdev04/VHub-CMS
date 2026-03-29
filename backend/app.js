import cors from 'cors';
import express from 'express';
import apiRouter from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);
app.use(errorMiddleware);

export default app;
