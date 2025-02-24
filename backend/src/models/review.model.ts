import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    seller: mongoose.Types.ObjectId;
    reviewer: mongoose.Types.ObjectId;
    bike: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    transactionType: 'purchase' | 'rental';
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bike: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    rating: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    comment: { type: String, required: true },
    transactionType: {
        type: String,
        enum: ['purchase', 'rental'],
        required: true
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews
ReviewSchema.index({ reviewer: 1, bike: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);
