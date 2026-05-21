import { Router } from 'express';
import { getPublicProposal, acceptProposal, downloadInvoicePDF } from '../controllers/invoiceController.js';

const router = Router();

// Public routes (no auth middleware needed since these are for the end-client viewing the proposal)
router.get('/:id/proposal', getPublicProposal);
router.post('/:id/accept', acceptProposal);
router.get('/:id/pdf', downloadInvoicePDF);

export default router;
