import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base/base.controller';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

// Type-safe JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

// Define expiresIn with proper type
const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
const jwtOptions: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn']
};

export class UserController extends BaseController<IUser> {
    private userService: UserService;

    constructor() {
        const service = new UserService();
        super(service);
        this.userService = service;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await this.userService.create({
                ...req.body,
                password: hashedPassword
            });
            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET as jwt.Secret,
                jwtOptions
            );
            
            res.status(201).json({ user, token });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.findByEmail(email);
            
            if (!user || !(await bcrypt.compare(password, user.password))) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            
            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET as jwt.Secret,
                jwtOptions
            );
            
            res.json({ user, token });
        } catch (error) {
            next(error);
        }
    }

    async uploadDocuments(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const documentUrls = {
                idProof: files.idProof ? files.idProof[0].path : undefined,
                businessLicense: files.businessLicense ? files.businessLicense[0].path : undefined
            };

            const user = await this.userService.updateDocuments(req.user.id, documentUrls);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, status } = req.body;
            const user = await this.userService.updateVerificationStatus(userId, status);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async getPendingVerifications(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.findPendingVerifications();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findById(req.user.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
    
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedUser = await this.userService.update(req.user.id, req.body);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
    async setup(req: Request, res: Response, next: NextFunction) {
        try {
            if(req.user.setup) {
                res.status(400).json({ message: 'User has already completed setup' });
            }
            
            const user = await this.userService.update(req.user.id, { setup: true, ...req.body });
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}
