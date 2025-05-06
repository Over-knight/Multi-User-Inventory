import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    price: number;
    sku: string;
    description: string;
    quantity: number;
    threshold: number;
    category?: mongoose.Schema.Types.ObjectId;
    store: mongoose.Schema.Types.ObjectId;
    imageUrls: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    sku: {type: String, required: true, unique: true, sparse: true},
    description: {type: String},
    quantity: {type: Number, required: true, default: 0},
    threshold: {type: Number, default: 0},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    store: {type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true},
    imageUrls: [{type: String}],
    isActive: {type: Boolean, default: true},
},
{timestamps: true}
);

const product = mongoose.model<IProduct>("Product", productSchema);
export default product;