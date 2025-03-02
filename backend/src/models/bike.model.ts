import mongoose, { Schema, Document } from 'mongoose';

export interface IBike extends Document {
    title: string;
    brand: string;
    bikeModel: string;
    year: number;
    category: string;
    description: string;
    images: string[];
    purpose: 'sale' | 'rent' | 'both';
    pricing: {
        salePrice?: number;
        rentalPrice?: {
            hourly?: number;
            daily?: number;
            weekly?: number;
            monthly?: number;
        };
    };
    specifications: {
        engineCC: number;
        mileage?: number;
        condition: 'new' | 'used';
    };
    seller: mongoose.Types.ObjectId;
    location: {
        address: string;
        city: string;
        state: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        }
    };
    status: 'available' | 'sold' | 'rented' | 'maintenance';
    documents: {
        registration?: string;
        insurance?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BikeSchema: Schema = new Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    bikeModel: { type: String, required: true },
    year: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ['sports', 'cruiser', 'vintage', 'scooter', 'commuter', 'adventure'],
        required: true 
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    purpose: { 
        type: String, 
        enum: ['sale', 'rent', 'both'],
        required: true 
    },
    pricing: {
        salePrice: Number,
        rentalPrice: {
            hourly: Number,
            daily: Number,
            weekly: Number,
            monthly: Number
        }
    },
    specifications: {
        engineCC: { type: Number, required: true },
        mileage: Number,
        condition: { 
            type: String, 
            enum: ['new', 'used'],
            required: true 
        }
    },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        address: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    status: { 
        type: String, 
        enum: ['available', 'sold', 'rented', 'maintenance'],
        default: 'available'
    },
    documents: {
        registration: String,
        insurance: String
    }
}, {
    timestamps: true
});

// Add index for location-based queries
BikeSchema.index({ 'location.city': 1, 'location.state': 1 });
BikeSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IBike>('Bike', BikeSchema);
