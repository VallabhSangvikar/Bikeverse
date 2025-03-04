import { BaseService } from './base.service';
import Bike, { IBike } from "../models/bike.model";
import { HttpException } from '../middleware/error.middleware';

export class BikeService extends BaseService<IBike> {
    constructor() {
        super(Bike);
    }

    // Search bikes with filters
    async searchBikes(filters: {
        category?: string;
        city?: string;
        state?: string;
        purpose?: 'sale' | 'rent' | 'both';
        priceRange?: { min?: number; max?: number };
        condition?: 'new' | 'used';
    }) {
        const query: any = { status: 'available' };

        // if (filters.category) query.category = filters.category;
        if (filters.city) query['location.city'] = filters.city;
        if (filters.state) query['location.state'] = filters.state;
        // if (filters.purpose) query.purpose = filters.purpose;
        if (filters.condition) query['specifications.condition'] = filters.condition;

        if (filters.priceRange) {
            const priceQuery: any = {};
            if (filters.priceRange.min !== undefined) priceQuery['$gte'] = filters.priceRange.min;
            if (filters.priceRange.max !== undefined) priceQuery['$lte'] = filters.priceRange.max;
            if (Object.keys(priceQuery).length) query['pricing.salePrice'] = priceQuery;
        }
        const bikes = await Bike.find(query);//.populate('owner');
        return bikes;
    }

    // Get all bikes
    async getAllBikes(): Promise<IBike[]> {
        return Bike.find().populate('seller', 'name businessType rating');
    }

    // Get bike by ID
    async getBikeById(id: string): Promise<IBike | null> {
        const bike = await Bike.findById(id).populate('seller', 'name businessType rating');
        if (!bike) throw new HttpException(404, 'Bike not found');
        return bike;
    }

    // Create a new bike
    async createBike(bikeData: IBike): Promise<IBike> {
        const newBike = new Bike(bikeData);
        return await newBike.save();
    }

    // Update an existing bike
    async updateBike(id: string, updateData: Partial<IBike>): Promise<IBike | null> {
        const updatedBike = await Bike.findByIdAndUpdate(id, updateData, { new: true }).populate(
            'seller',
            'name businessType rating'
        );
        if (!updatedBike) throw new HttpException(404, 'Bike not found');
        return updatedBike;
    }

    // Delete a bike
    async deleteBike(id: string): Promise<IBike | null> {
        const deletedBike = await Bike.findByIdAndDelete(id);
        if (!deletedBike) throw new HttpException(404, 'Bike not found');
        return deletedBike;
    }

    // Update bike status
    async updateBikeStatus(bikeId: string, status: IBike['status']) {
        const bike = await Bike.findById(bikeId);
        if (!bike) throw new HttpException(404, 'Bike not found');

        bike.status = status;
        return await bike.save();
    }
}
