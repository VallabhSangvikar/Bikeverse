import { BaseService } from './base.service';
import Product, { IProduct } from '../models/product.model';
import { HttpException } from '../middleware/error.middleware';

export class ProductService extends BaseService<IProduct> {
    constructor() {
        super(Product);
    }

    async findByCategory(category: string): Promise<IProduct[]> {
        return Product.find({ category }).populate('seller', 'name email');
    }

    async searchProducts(query: string): Promise<IProduct[]> {
        return Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate('seller', 'name email');
    }

    async updateStock(productId: string, quantity: number): Promise<IProduct> {
        const product = await Product.findById(productId);
        if (!product) {
            throw new HttpException(404, 'Product not found');
        }
        if (product.stock + quantity < 0) {
            throw new HttpException(400, 'Insufficient stock');
        }
        product.stock += quantity;
        return product.save();
    }
}
