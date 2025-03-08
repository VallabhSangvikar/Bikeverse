import { BaseService } from './base.service';
import Review, { IReview } from '../models/review.model';
import User from '../models/user.model';
import { HttpException } from '../middleware/error.middleware';

export class ReviewService extends BaseService<IReview> {
    constructor() {
        super(Review);
    }

    async getBikeReviews(bikeId: string) {
        return Review.find({ bike: bikeId }).populate('reviewer', 'name');
    }
    async MyReviews(userId: string) {
        return Review.find({ reviewer: userId }).populate('bike', 'title images').populate('seller', 'name');
    }
    private async updateSellerRating(sellerId: string) {
        const reviews = await Review.find({ seller: sellerId });
        if (!reviews.length) return;

        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        
        await User.findByIdAndUpdate(sellerId, {
            rating: Number(averageRating.toFixed(1))
        });
    }
}
