import { BaseService } from './base.service';
import User, { IUser } from '../models/user.model';
import { HttpException } from '../middleware/error.middleware';

export class UserService extends BaseService<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        return user;
    }

    async findByEmailWithoutError(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        // Password validation would go here
        await User.updateOne({ _id: userId }, { password: newPassword });
        return true;
    }

    async updateVerificationStatus(userId: string, status: 'pending' | 'verified' | 'rejected'): Promise<IUser> {
        const user:any = await User.findById(userId);
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        if (user.role !== 'seller') {
            throw new HttpException(400, 'Only seller accounts can be verified');
        }

        user.documents = {
            ...user.documents,
            verificationStatus: status
        };

        return user.save();
    }

    async findPendingVerifications(): Promise<IUser[]> {
        return User.find({
            role: 'seller',
            'documents.verificationStatus': 'pending'
        });
    }

    async updateDocuments(userId: string, documents: { idProof?: string; businessLicense?: string }): Promise<IUser> {
        const user:any = await User.findById(userId);
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        if (user.role !== 'seller') {
            throw new HttpException(400, 'Only sellers can upload documents');
        }

        user.documents = {
            ...user.documents,
            ...documents,
            verificationStatus: 'pending' // Reset to pending when new documents are uploaded
        };

        return user.save();
    }
}
