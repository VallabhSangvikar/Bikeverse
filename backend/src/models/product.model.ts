import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    seller: mongoose.Types.ObjectId;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
