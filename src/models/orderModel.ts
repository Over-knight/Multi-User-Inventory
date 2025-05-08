import mongoose from "mongoose";
import { Schema } from "zod";


interface OrderItem {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
}

const OrderItemSchema = new mongoose.Schema<OrderItem>({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: {type: Number, required: true, default: 0},
    price: {type: Number, required: true}
},
{ _id: false } // Prevents creation of an additional _id field for each item)
);
export interface IOrder extends mongoose.Document {
    
    store: mongoose.Schema.Types.ObjectId;
    items: OrderItem[];
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    totalAmount: number;
    status: "pending" | "processing" |  "shipped" | "delivered" |  "cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    items: { type: [OrderItemSchema], required: true, validate: (v: OrderItem[]) => v.length > 0},
    customerName: {type: String},
    customerEmail: {type: String},
    customerPhone: {type: String},
    totalAmount: { type: Number, required: true },
    status: { type: String, 
        enum: ["pending", "processing", "shipped", "delivered", "cancelled" ],
        default: "pending" }, // e.g., "pending", "completed", "cancelled"
}, { timestamps: true }
);


const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;