import { BaseService } from './base.service';
import Bike, { IBike } from '../models/bike.model';
import { HttpException } from '../middleware/error.middleware';

export class BikeService extends BaseService<IBike> {
    constructor() {
        super(Bike);
    }

    async searchBikes(filters: {
        category?: string;
        city?: string;
        state?: string;
        purpose?: 'sale' | 'rent' | 'both';
        priceRange?: { min?: number; max?: number };
        condition?: 'new' | 'used';
    }) {
        const query: any = { status: 'available' };

        if (filters.category) query.category = filters.category;
        if (filters.city) query['location.city'] = filters.city;
        if (filters.state) query['location.state'] = filters.state;
        if (filters.purpose) query.purpose = filters.purpose;
        if (filters.condition) query['specifications.condition'] = filters.condition;
        
        if (filters.priceRange) {
            const priceQuery: any = {};
            if (filters.priceRange.min) priceQuery['$gte'] = filters.priceRange.min;
            if (filters.priceRange.max) priceQuery['$lte'] = filters.priceRange.max;
            if (Object.keys(priceQuery).length) {
                query['pricing.salePrice'] = priceQuery;
            }
        }

        return Bike.find(query)
            .populate('seller', 'name businessType rating')
            .sort('-createdAt');
    }

    async updateBikeStatus(bikeId: string, status: IBike['status']) {
        const bike = await Bike.findById(bikeId);
        if (!bike) throw new HttpException(404, 'Bike not found');
        
        bike.status = status;
        return bike.save();
    }
}
