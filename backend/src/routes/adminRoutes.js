import express from 'express';
import { getUsers, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('super_admin', 'auditor', 'support'));


// User management
router.get('/users', getUsers);
router.delete('/users/:id', authorize('super_admin'), deleteUser);

export default router;
