import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware, roleCheck } from '../middleware/auth.middleware';

const router = Router();
const bookingController = new BookingController();

router.use(authMiddleware);

// Buyer routes
router.post('/', roleCheck(['buyer']), bookingController.createBooking.bind(bookingController));

// Common routes
router.get('/my-bookings', bookingController.getMyBookings.bind(bookingController));
router.get('/:id', bookingController.getById.bind(bookingController));

// Seller routes
router.patch('/:id/status', roleCheck(['seller']), bookingController.updateStatus.bind(bookingController));

export default router;
