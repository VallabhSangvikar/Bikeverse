import { BaseService } from './base.service';
import Booking, { IBooking } from '../models/booking.model';
import { BikeService } from './bike.service';
import { HttpException } from '../middleware/error.middleware';

export class BookingService extends BaseService<IBooking> {
    private bikeService: BikeService;

    constructor() {
        super(Booking);
        this.bikeService = new BikeService();
    }

    async createBooking(bookingData: Partial<IBooking>) {
        const bike = await this.bikeService.findById(bookingData.bike!.toString());
        
        if (bike.status !== 'available') {
            throw new HttpException(400, 'Bike is not available for booking');
        }

        if (bookingData.type === 'rental' && (!bookingData.rentalDuration?.startDate || !bookingData.rentalDuration?.endDate)) {
            throw new HttpException(400, 'Rental duration is required for rental bookings');
        }

        const booking = await Booking.create(bookingData);
        
        // Update bike status
        await this.bikeService.updateBikeStatus(booking.bike.toString(), 'rented');
        
        return booking;
    }

    async updateBookingStatus(bookingId: string, status: IBooking['status']) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new HttpException(404, 'Booking not found');
        }

        booking.status = status;
        
        if (status === 'completed' || status === 'cancelled') {
            await this.bikeService.updateBikeStatus(booking.bike.toString(), 'available');
        }

        return booking.save();
    }

    async getSellerBookings(sellerId: string) {
        return Booking.find({ seller: sellerId })
            .populate('bike')
            .populate('buyer', 'name phone email')
            .sort('-createdAt');
    }

    async getBuyerBookings(buyerId: string) {
        return Booking.find({ buyer: buyerId })
            .populate('bike')
            .populate('seller', 'name businessType rating')
            .sort('-createdAt');
    }
}
