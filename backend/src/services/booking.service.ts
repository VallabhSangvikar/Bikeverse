import { BaseService } from './base.service';
import Booking, { IBooking } from '../models/booking.model';
import { BikeService } from './bike.service';
import { HttpException } from '../middleware/error.middleware';
import User from '../models/user.model';
export class BookingService extends BaseService<IBooking> {
    private bikeService: BikeService;

    constructor() {
        super(Booking);
        this.bikeService = new BikeService();
    }

    async createBooking(bookingData: Partial<IBooking>) {
        const bike = await this.bikeService.findById(bookingData.bike!.toString());
        if (!bike) {
            throw new HttpException(404, 'Bike not found');
        }
        
        if (bike.status !== 'available') {
            throw new HttpException(400, 'Bike is not available for booking');
        }

        if (!bookingData.seller) {
            throw new HttpException(400, 'Seller information is required');
        }

        if (bookingData.type === 'rental' && (!bookingData.rentalDuration?.startDate || !bookingData.rentalDuration?.endDate)) {
            throw new HttpException(400, 'Rental duration is required for rental bookings');
        }

        const booking = await Booking.create(bookingData);

        return booking;
    }

    async updateBookingStatus(bookingId: string, status: IBooking['status'],message:string) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new HttpException(404, 'Booking not found');
        }

        booking.status = status;
        const Existingmessage=booking.message;
        Existingmessage?.push(message);
        booking.message=Existingmessage;
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
       // First, get all bookings
const bookings = await Booking.find({ buyer: buyerId })
.populate('bike')
.populate('seller', 'name businessType rating')
.sort('-createdAt');

// Then, process the bookings to add additional seller info where needed
const result = await Promise.all(bookings.map(async (booking) => {
// Convert the Mongoose document to a plain JavaScript object
const bookingObj = booking.toObject();

if (booking.status === 'accepted' || booking.status === 'completed') {
  // If booking is accepted/completed, get more seller details
  const fullSellerInfo = await User.findById(booking.seller._id)
    .select('name businessType rating phone email address documents');
  
  if (fullSellerInfo) {
    // Replace the seller with more complete info
    bookingObj.seller = fullSellerInfo.toObject();
  }
}

return bookingObj;
}));
        return result;
    }
}
