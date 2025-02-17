import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base/base.controller';
import { ProductService } from '../services/product.service';
import { IProduct } from '../models/product.model';
import { HttpException } from '../middleware/error.middleware';

export class ProductController extends BaseController<IProduct> {
    private productService: ProductService;

    constructor() {
        const service = new ProductService();
        super(service);
        this.productService = service;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this.productService.create({
                ...req.body,
                seller: req.user.id
            });
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this.productService.findById(req.params.id);
            if (product.seller.toString() !== req.user.id) {
                throw new HttpException(403, 'Not authorized to update this product');
            }
            const updated = await this.productService.update(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
}
