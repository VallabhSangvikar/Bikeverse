import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base/base.controller';
import { BikeService } from '../services/bike.service';
import { IBike } from '../models/bike.model';
import { HttpException } from '../middleware/error.middleware';

export class BikeController extends BaseController<IBike> {
    private bikeService: BikeService;

    constructor() {
        const service = new BikeService();
        super(service);
        this.bikeService = service;
    }

    async search(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Hello from Bikecontroller");
            const filters = {
                category: req.query.category as string,
                city: req.query.city as string,
                state: req.query.state as string,
                purpose: req.query.purpose as 'sale' | 'rent' | 'both',
                priceRange: req.query.priceRange ? JSON.parse(req.query.priceRange as string) : undefined,
                condition: req.query.condition as 'new' | 'used'
            };

            const bikes = await this.bikeService.searchBikes(filters);
            res.json(bikes);
        } catch (error) {
            next(error);
        }
    }

    
}
