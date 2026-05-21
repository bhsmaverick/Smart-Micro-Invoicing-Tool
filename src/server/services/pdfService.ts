import puppeteer from 'puppeteer';

interface InvoiceData {
  id: string;
  issueDate: Date;
  dueDate: Date | null;
  totalAmount: number;
  status: string;
  client: { name: string; email: string };
  user: { name: string | null; email: string };
  lineItems: Array<{ description: string; quantity: number; price: number }>;
}

export const generateInvoicePDF = async (invoice: InvoiceData, paymentUrl?: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    
    // Simple HTML template for the invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; margin: 0; padding: 40px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; color: #1a56db; }
          .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .details div { width: 48%; }
          .details h3 { margin-top: 0; color: #666; font-size: 14px; text-transform: uppercase; }
          .details p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
          th { background-color: #f9fafb; font-weight: 600; color: #4b5563; }
          .total-row { font-weight: bold; font-size: 18px; }
          .total-row td { border-top: 2px solid #333; }
          .text-right { text-align: right; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; page-break-inside: avoid; }
          .payment-link { margin-top: 30px; padding: 15px; background: #eef2ff; border-radius: 8px; text-align: center; }
          .payment-link a { color: #4f46e5; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">INVOICE</div>
          <div class="text-right">
            <p><strong>Invoice #:</strong> ${invoice.id}</p>
            <p><strong>Date:</strong> ${invoice.issueDate.toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold;">${invoice.status}</span></p>
          </div>
        </div>

        <div class="details">
          <div>
            <h3>From</h3>
            <p><strong>${invoice.user.name || 'Vendor'}</strong></p>
            <p>${invoice.user.email}</p>
          </div>
          <div class="text-right">
            <h3>Bill To</h3>
            <p><strong>${invoice.client.name}</strong></p>
            <p>${invoice.client.email}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${item.price.toFixed(2)}</td>
                <td class="text-right">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3" class="text-right">Total Amount</td>
              <td class="text-right">$${invoice.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        ${paymentUrl ? `
        <div class="payment-link">
          <p>You can pay this invoice securely online:</p>
          <a href="${paymentUrl}">Click here to pay via Stripe</a>
        </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};
