import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base/base.controller';
import { BookingService } from '../services/booking.service';
import { IBooking } from '../models/booking.model';

export class BookingController extends BaseController<IBooking> {
    private bookingService: BookingService;

    constructor() {
        const service = new BookingService();
        super(service);
        this.bookingService = service;
    }

    async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const bookingData = {
                ...req.body,
                buyer: req.user.id
            };
            const booking = await this.bookingService.createBooking(bookingData);
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status,message,price } = req.body;
            const booking = await this.bookingService.updateBookingStatus(req.params.id, status,message,price);
            res.json(booking);
        } catch (error) {
            next(error);
        }
    }

    async getMyBookings(req: Request, res: Response, next: NextFunction) {
        try {
            let bookings;
            if (req.user.role === 'seller') {
                bookings = await this.bookingService.getSellerBookings(req.user.id);
            } else {
                bookings = await this.bookingService.getBuyerBookings(req.user.id);
            }
            res.json(bookings);
        } catch (error) {
            next(error);
        }
    }
}
