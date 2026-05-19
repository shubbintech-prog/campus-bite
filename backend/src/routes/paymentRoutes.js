import express from 'express';
import { initPayment, handleWebhook, simulatePaymentSuccess } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', protect, initPayment);
router.post('/simulate-success', simulatePaymentSuccess);
router.post('/webhook', handleWebhook);

export default router;
