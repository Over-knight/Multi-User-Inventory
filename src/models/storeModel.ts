import mongoose from "mongoose";

interface Invite {
    email: string;
    token: string;
    invitedAt: Date;
    acceptedAt?: Date;
}

export interface IStore extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    storeName: string;
    description: string;
    vendor: mongoose.Schema.Types.ObjectId;
    address: string;
    phone: string;
    staff: mongoose.Schema.Types.ObjectId[];
    invites: Invite[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InviteSchema = new mongoose.Schema<Invite>(
    {
    email: {type: String, required: true},
    token: {type: String, required: true},
    invitedAt: {type: Date, default: Date.now},
    acceptedAt: {type: Date}
    },
    { _id: false }
);

const storeSchema = new mongoose.Schema({
    storeName: {type: String, required: true},
    description: {type: String, required: true},
    vendor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    staff: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    invites: [InviteSchema],
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
},
{ timestamps: true }
);

const Store = mongoose.model<IStore>("Store", storeSchema);
export default Store;