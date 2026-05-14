import express from 'express';
import { initPayment, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', protect, initPayment);
router.post('/webhook', handleWebhook);

export default router;
