import express from 'express';
import { registerUser, loginUser, getMe, switchRole, upgradeSeller } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/switch-role', protect, switchRole);
router.post('/upgrade-seller', protect, upgradeSeller);

export default router;
