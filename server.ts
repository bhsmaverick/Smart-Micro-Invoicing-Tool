import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import authRoutes from './src/server/routes/authRoutes.js';
import stripeRoutes from './src/server/routes/stripeRoutes.js';
import webhookRoutes from './src/server/routes/webhookRoutes.js';

import invoiceRoutes from './src/server/routes/invoiceRoutes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Stripe Webhooks (must be before express.json() to get raw body)
  app.use('/api/webhooks/stripe', webhookRoutes);

  // Middleware for standard JSON parsing
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/stripe', stripeRoutes);
  app.use('/api/invoices', invoiceRoutes);

  // Setup Vite middleware for SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
