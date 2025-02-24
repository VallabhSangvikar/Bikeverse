import { Router } from 'express';
import userRoutes from './user.routes';
import bikeRoutes from './bike.routes';
import bookingRoutes from './booking.routes';

const router = Router();

router.use('/auth', userRoutes);
router.use('/bikes', bikeRoutes);
router.use('/bookings', bookingRoutes);

export default router;
