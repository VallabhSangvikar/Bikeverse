import { Request, Response, NextFunction } from 'express';
import { HttpException } from './error.middleware';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
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