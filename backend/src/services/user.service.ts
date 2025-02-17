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
}
