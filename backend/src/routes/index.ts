import { Router } from 'express';
import userRoutes from './user.routes';
import bikeRoutes from './bike.routes';
import bookingRoutes from './booking.routes';
import postRoutes from './posts.routes';
import reviewRoutes from './review.routes';

const router = Router();

router.use('/auth', userRoutes);
router.use('/bikes', bikeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/posts', postRoutes);
router.use('/reviews', reviewRoutes);

export default router;
