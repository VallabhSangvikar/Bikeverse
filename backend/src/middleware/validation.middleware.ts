import { Request, Response, NextFunction } from 'express';
import { HttpException } from './error.middleware';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;
    
    if (!email || !email.includes('@')) {
        throw new HttpException(400, 'Valid email is required');
    }
    
    if (!password || password.length < 6) {
        throw new HttpException(400, 'Password must be at least 6 characters');
    }
    
    if (!name || name.length < 2) {
        throw new HttpException(400, 'Valid name is required');
    }
    
    next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, stock } = req.body;
    
    if (!name || name.length < 3) {
        throw new HttpException(400, 'Valid product name is required');
    }
    
    if (!description || description.length < 10) {
        throw new HttpException(400, 'Valid description is required');
    }
    
    if (!price || price <= 0) {
        throw new HttpException(400, 'Valid price is required');
    }
    
    if (stock < 0) {
        throw new HttpException(400, 'Stock cannot be negative');
    }
    
    next();
};
