import { Router } from 'express';
import { listCars, seedSampleCars } from '../controllers/carController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listCars);
router.post('/seed', requireAuth, requireAdmin, seedSampleCars);

export default router;
