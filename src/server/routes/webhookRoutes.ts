import { Router } from 'express';
import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = Router();

// Webhook endpoint needs the raw body to verify exactly what Stripe sent
router.post('/', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
