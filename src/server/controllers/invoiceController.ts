import { Request, Response } from 'express';
import prisma from '../db.js';
import { generateInvoicePDF } from '../services/pdfService.js';
import { getStripe } from './stripeController.js';

export const getPublicProposal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        lineItems: true,
        client: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('[InvoiceController/getPublicProposal] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const acceptProposal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    if (invoice.status !== 'DRAFT' && invoice.status !== 'SENT') {
      res.status(400).json({ error: 'Proposal is already accepted or paid' });
      return;
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('[InvoiceController/acceptProposal] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadInvoicePDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        lineItems: true,
        client: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Attempt to generate a payment link if the invoice is accepted but not paid
    let paymentUrl = '';
    if (invoice.status === 'ACCEPTED') {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: invoice.lineItems.map(item => ({
            price_data: {
              currency: 'usd',
              product_data: { name: item.description },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${process.env.APP_URL || 'http://localhost:3000'}/proposal/${invoice.id}/success`,
          cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/proposal/${invoice.id}`,
          client_reference_id: invoice.id,
          metadata: { invoiceId: invoice.id },
        });
        paymentUrl = session.url || '';
      } catch (stripeErr) {
        console.warn('Failed to attach Stripe payment link to PDF:', stripeErr);
      }
    }

    const pdfBuffer = await generateInvoicePDF(invoice, paymentUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[InvoiceController/downloadInvoicePDF] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
