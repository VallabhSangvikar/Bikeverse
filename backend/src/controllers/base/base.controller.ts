import { Request, Response, NextFunction } from 'express';
import { IBaseService } from '../../interfaces/base.interface';

export abstract class BaseController<T> {
    protected service: IBaseService<T>;

    constructor(service: IBaseService<T>) {
        this.service = service;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.create(req.body);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.update(req.params.id, req.body);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.service.delete(req.params.id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.findById(req.params.id);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await this.service.findAll(req.query);
            return res.json(results);
        } catch (error) {
            next(error);
        }
    }
}
