import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../db.js';
import { getStripe } from './stripeController.js';

/**
 * Handles Stripe webhook events, specifically checkout.session.completed
 * to update the invoice status to PAID.
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).send('Missing stripe-signature or webhook secret');
    return;
  }

  let event: Stripe.Event;
  let stripe: Stripe;

  try {
    stripe = getStripe();
    // Verify the webhook signature using the raw request body
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('[WebhookController] Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve the invoice ID from the metadata
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
