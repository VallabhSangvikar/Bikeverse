import { Model } from 'mongoose';
import { IBaseService } from '../interfaces/base.interface';

export class BaseService<T> implements IBaseService<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        const created = await this.model.create(data);
        return created.toObject();
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        const updated = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!updated) throw new Error('Document not found');
        return updated.toObject();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }

    async findById(id: string): Promise<T> {
        const found = await this.model.findById(id);
        if (!found) throw new Error('Document not found');
        return found.toObject();
    }

    async findAll(filter: object = {}): Promise<T[]> {
        return this.model.find(filter).lean();
    }
}
