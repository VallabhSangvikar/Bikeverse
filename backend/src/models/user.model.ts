import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'buyer' | 'seller' | 'admin';
    name: string;
    phone?: string;
    // Seller specific fields
    businessType?: 'showroom' | 'individual';
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        }
    };
    documents?: {
        idProof: string;
        businessLicense?: string;
        verificationStatus: 'pending' | 'verified' | 'rejected';
    };
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    name: { type: String, required: true },
    phone: { type: String},
    businessType: { 
        type: String, 
        enum: ['showroom', 'individual'],
        required: function(this: IUser) { 
            return this.role === 'seller';
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    documents: {
        idProof: String,
        businessLicense: String,
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        }
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
