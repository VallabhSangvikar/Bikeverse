import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { BaseController } from './base/base.controller';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { uploadCloudinary } from '../uploadCloudinary';

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
    async setupProfile(req: Request, res: Response, next: NextFunction) {
        req.body.address = {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            coordinates: {
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
        };
        if (req.files) {
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({ message: 'No files uploaded' });
                return;
            }
            const files = req.files as { [key: string]: UploadedFile }

                const idProof = files['idProof'] as UploadedFile;
                const businessLicense = files['businessLicense'] as UploadedFile;
                const url1 = await uploadCloudinary(idProof.data);
                const url2 = await uploadCloudinary(businessLicense.data);
                
                req.body = {
                    ...req.body,
                    documents: {
                        idProof: url1,
                        businessLicense: url2,
                        verificationStatus: 'pending'
                    }
                };
        }
        req.body.setup = true;
        const result=await this.update(req, res, next);
        return result;
    }
}
