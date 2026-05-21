import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    // Omit explicit apiVersion to use the SDK's bundled default version
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

/**
 * Creates a Stripe Checkout session for a specific invoice.
 * Requires an authenticated user.
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { invoiceId, currency = 'usd' } = req.body;

    if (!invoiceId) {
      res.status(400).json({ error: 'Invoice ID is required' });
      return;
    }

    // Always fetch invoice to verify it exists and belongs to user
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { lineItems: true },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (invoice.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this invoice' });
      return;
    }
    
    if (invoice.status === 'PAID') {
      res.status(400).json({ error: 'Invoice is already paid' });
      return;
    }

    const stripe = getStripe();

    const line_items: any[] = invoice.lineItems.map(item => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${appUrl}/invoice/${invoice.id}/success`,
      cancel_url: `${appUrl}/invoice/${invoice.id}`,
      client_reference_id: invoice.id,
      metadata: {
        invoiceId: invoice.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('[StripeController/createCheckoutSession] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error while creating checkout session' });
  }
};
