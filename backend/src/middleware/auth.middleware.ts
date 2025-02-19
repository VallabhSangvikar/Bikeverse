import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from './error.middleware';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new HttpException(401, 'Authentication token missing');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        
        next();
    } catch (error) {
        next(new HttpException(401, 'Invalid authentication token'));
    }
};

export const roleCheck = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            next(new HttpException(403, 'Access forbidden'));
            return;
        }
        if(req.user.role=="seller"){
            req.body.seller=req.user.id;
        }
        if(req.user.role=="buyer"){
            req.body.buyer=req.user.id;
        }
        next();
    };
};
