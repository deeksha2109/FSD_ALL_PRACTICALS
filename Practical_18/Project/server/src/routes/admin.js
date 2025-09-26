import { Router } from 'express';
import { listBookings, approveBooking, rejectBooking } from '../controllers/bookingController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/bookings', requireAuth, requireAdmin, listBookings);
router.patch('/bookings/:id/approve', requireAuth, requireAdmin, approveBooking);
router.patch('/bookings/:id/reject', requireAuth, requireAdmin, rejectBooking);

export default router;
