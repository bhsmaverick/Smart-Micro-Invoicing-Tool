import { Router } from 'express';
import { createCheckoutSession } from '../controllers/stripeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Requires authentication to create a session
router.post('/create-checkout-session', authenticate, createCheckoutSession);

export default router;
