import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base/base.controller";
import { BikeService } from "../services/bike.service";
import { IBike } from "../models/bike.model"; // ✅ IBike is correctly imported
import { HttpException } from "../middleware/error.middleware";

export class BikeController extends BaseController<IBike> {
    private bikeService: BikeService;

    constructor() {
        const service = new BikeService();
        super(service);
        this.bikeService = service;
    }

    // Get all bikes
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        try {
            const filters = {
                category: req.query.category as string,
                city: req.query.city as string,
                state: req.query.state as string,
                purpose: req.query.purpose as "sale" | "rent" | "both",
                priceRange: req.query.priceRange ? JSON.parse(req.query.priceRange as string) : undefined,
                condition: req.query.condition as "new" | "used",
            };

            const bikes = await this.bikeService.searchBikes(filters);
            return res.json(bikes);
        } catch (error) {
            next(error);
            return undefined;
        }
    }

    // Create a new bike (Only sellers)
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        try {
            const newBike = await this.bikeService.createBike(req.body);
            return res.status(201).json(newBike);
        } catch (error) {
            next(error);
            return undefined;
        }
    }

    // Update a bike (Only sellers)
    async update(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        try {
            const { id } = req.params;
            const updatedBike = await this.bikeService.updateBike(id, req.body);
            if (!updatedBike) throw new HttpException(404, "Bike not found");
            return res.json(updatedBike);
        } catch (error) {
            next(error);
            return undefined;
        }
    }

    // Delete a bike (Only sellers)
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        try {
            const { id } = req.params;
            const deletedBike = await this.bikeService.deleteBike(id);
            if (!deletedBike) throw new HttpException(404, "Bike not found");
            return res.json({ message: "Bike deleted successfully" });
        } catch (error) {
            next(error);
            return undefined;
        }
    }
}

// ❌ Removed: export default Bike;
// ❌ Removed: export interface IBike { ... }
