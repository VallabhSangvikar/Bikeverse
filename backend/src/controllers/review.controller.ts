import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { BaseController } from './base/base.controller';
import { IReview } from '../models/review.model';

export class ReviewController extends BaseController<IReview> {
    private reviewService: ReviewService;

    constructor() {
        const service = new ReviewService();
        super(service);
        this.reviewService = service;
    }

    async createReview(req: Request, res: Response, next: NextFunction) {
        try {
            const review = await this.reviewService.create(req.body);
            res.status(201).json(review);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getBikeReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const reviews = await this.reviewService.getBikeReviews(req.params.bikeid);
            res.status(200).json(reviews);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }   
    async updateReview(req: Request, res: Response, next: NextFunction) {
        try {
            const review = await this.reviewService.update(req.params.id, req.body);
            res.status(200).json(review);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteReview(req: Request, res: Response, next: NextFunction) {
        try {
            await this.reviewService.delete(req.params.id);
            res.status(204).end();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}