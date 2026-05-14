import express from 'express';
import { applyAsVendor, getApplications, reviewApplication } from '../controllers/vendorApplicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, authorize('student'), applyAsVendor);
router.get('/', protect, authorize('super_admin', 'auditor', 'support'), getApplications);
router.put('/:id/review', protect, authorize('super_admin', 'auditor', 'support'), reviewApplication);

export default router;
