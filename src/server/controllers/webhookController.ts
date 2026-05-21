import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../db.js';
import { getStripe } from './stripeController.js';

/**
 * Handles Stripe webhook events, specifically checkout.session.completed
 * to update the invoice status to PAID.
 * 
 * IMPORTANT: This controller relies on receiving the RAW request body to verify the Stripe signature.
 * Ensure that the route using this controller is configured with `express.raw({ type: 'application/json' })`
 * middleware *before* any other broad `express.json()` middleware is applied in the server setup.
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).send('Missing stripe-signature or webhook secret');
    return;
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    // Verify the webhook signature using the raw request body. 
    // If the body was parsed by express.json(), this would fail because the signature is computed on the raw bytes.
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('[WebhookController] Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract the invoiceId from metadata (or fallback to client_reference_id)
    const invoiceId = session.metadata?.invoiceId || session.client_reference_id;

    if (invoiceId) {
      try {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' },
        });
        console.log(`[WebhookController] Invoice ${invoiceId} marked as PAID.`);
      } catch (dbError) {
        console.error(`[WebhookController] Failed to update invoice ${invoiceId}:`, dbError);
        res.status(500).send('Database error');
        return;
      }
    } else {
      console.warn('[WebhookController] No invoiceId found in session metadata.');
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
