import { BaseService } from './base.service';
import Review, { IReview } from '../models/review.model';
import User from '../models/user.model';
import { HttpException } from '../middleware/error.middleware';

export class ReviewService extends BaseService<IReview> {
    constructor() {
        super(Review);
    }

    async createReview(reviewData: Partial<IReview>) {
        // Check for existing review
        const review = await Review.create(reviewData);
        
        // // Update seller's rating
        // await this.updateSellerRating(reviewData.seller!.toString());
        
        return review;
    }
    async getBikeReviews(bikeId: string) {
        return Review.find({ bike: bikeId }).populate('reviewer', 'username');
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
