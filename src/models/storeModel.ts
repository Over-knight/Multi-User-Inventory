import mongoose from "mongoose";

export interface IStore extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    storeName: string;
    description: string;
    vendor: mongoose.Schema.Types.ObjectId[];
    staff: mongoose.Schema.Types.ObjectId[];
    address: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const storeSchema = new mongoose.Schema({
    storeName: {type: String, required: true},
    description: {type: String, required: true},
    vendor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Store = mongoose.model<IStore>("Store", storeSchema);
export default Store;