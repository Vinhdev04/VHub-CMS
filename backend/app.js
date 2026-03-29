import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);

app.use(express.static(frontendDistPath));

app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  return res.sendFile(path.join(frontendDistPath, 'index.html'), (error) => {
    if (error) {
      next();
    }
  });
});

app.use(errorMiddleware);

export default app;
