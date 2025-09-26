import { Router } from 'express';
import { signup, login, me, seedAdmin } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, me);

// Dev only: seed admin user
router.post('/seed-admin', seedAdmin);

export default router;
