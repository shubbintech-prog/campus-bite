import express from 'express';
import { getVendorMenu, addMenuItem, updateMenuItem, deleteMenuItem, getAllMenuItems } from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to get menu
router.get('/vendors/:id/menu', getVendorMenu);
router.get('/items', getAllMenuItems);

// Protected routes for menu management
router.post('/items', protect, authorize('vendor', 'admin'), upload.single('image'), addMenuItem);
router.put('/items/:id', protect, authorize('vendor', 'admin'), upload.single('image'), updateMenuItem);
router.delete('/items/:id', protect, authorize('vendor', 'admin'), deleteMenuItem);

export default router;
