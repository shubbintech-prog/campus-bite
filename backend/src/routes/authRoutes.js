import express from 'express';
import { registerUser, loginUser, getMe, switchRole, upgradeSeller, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/switch-role', protect, switchRole);
router.post('/upgrade-seller', protect, upgradeSeller);
router.put('/profile', protect, upload.single('image'), updateProfile);

export default router;
