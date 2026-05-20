import express from 'express';
import { createOrder, getOrders, getVendorOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/vendor', protect, getVendorOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('vendor', 'super_admin', 'support', 'auditor'), updateOrderStatus);

export default router;
