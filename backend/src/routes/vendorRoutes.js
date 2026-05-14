import express from 'express';
import { getVendors, getVendorById, createVendor, updateVendor } from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getVendors);
router.get('/:id', getVendorById);
router.post('/', protect, authorize('super_admin', 'support'), createVendor);
router.put('/:id', protect, authorize('super_admin', 'support', 'auditor', 'vendor'), updateVendor);

export default router;
