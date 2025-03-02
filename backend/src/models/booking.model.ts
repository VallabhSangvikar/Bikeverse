import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    bike: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    type: 'purchase' | 'rental';
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    rentalDuration?: {
        startDate: Date;
        endDate: Date;
    };
    message?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
    bike: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['purchase', 'rental'], required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    rentalDuration: {
        startDate: Date,
        endDate: Date
    },
    message: String,
    price: { type: Number, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
