import mongoose, { Schema, Document } from "mongoose";

export interface IBike extends Document {
  title: string;
  brand: string;
  bikeModel: string;
  year: number;
  category: "sports" | "cruiser" | "vintage" | "scooter" | "commuter" | "adventure";
  description: string;
  images: string[];
  purpose: "sale" | "rent" | "both";
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
    condition: "new" | "used";
  };
  seller: mongoose.Schema.Types.ObjectId;
  location: {
    address?: string;
    city: string;
    state: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  status: "available" | "sold" | "rented" | "maintenance";
  documents?: {
    registration?: string;
    insurance?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const BikeSchema: Schema = new Schema<IBike>(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    bikeModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900 },
    category: {
      type: String,
      enum: ["sports", "cruiser", "vintage", "scooter", "commuter", "adventure", "street", "scrambler", "naked"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    purpose: { type: String, enum: ["sale", "rent", "both"], required: true },
    pricing: {
      salePrice: { type: Number, min: 0 },
      rentalPrice: {
        hourly: { type: Number, min: 0 },
        daily: { type: Number, min: 0 },
        weekly: { type: Number, min: 0 },
        monthly: { type: Number, min: 0 },
      },
    },
    specifications: {
      engineCC: { type: Number, required: true, min: 50 },
      mileage: { type: Number, min: 0 },
      condition: { type: String, enum: ["new", "used"], required: true },
    },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      address: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      coordinates: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 },
      },
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented", "maintenance"],
      default: "available",
    },
    documents: {
      registration: { type: String, trim: true },
      insurance: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Bike = mongoose.model<IBike>("Bike", BikeSchema);
export default Bike;