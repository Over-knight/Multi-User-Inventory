import { Request, Response } from "express";
import Store, { IStore} from "../models/storeModel";
import User, { IUser } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createStore = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, description, address, phone} = req.body;
        const store = await Store.create({
            storeName: name,
            description,
            address,
            phone,
            vendor: req.user?.id
        });
        res.status(201).json(store);
    } catch (error) {
        console.error("Error creating store:", error);
        res.status(500).json({ message: "Error creating store", error });
        return;
    }
};
export const getMyStore = async (req: Request, res: Response): Promise<void> => {
    try{
        const stores = await Store.find({ vendor: req.user?.id });
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stores"});
    }
};

export const updateStore = async (req: Request, res: Response): Promise<void> => { 
    try{
        const storeId = req.params.id;
        const updates = req.body;
        const updated = await Store.findByIdAndUpdate(
            storeId,
            {$set: updates},
            { new: true, runValidators: true}       
        );
        if (!updated) {
            res.status(404).json({ message: "Store not found"});
            return;
        }
        res.status(200).json(updated);
        return;
    } catch (error) {
        console.error("Error updating store:", error);
        res.status(500).json({ message: "Error updating store", error});
        return;
    }
};

export const deleteStore = async (req: Request, res: Response): Promise<void> => {
    try{
        const storeId = req.params.id;
        const deleted = await Store.findByIdAndDelete(storeId);

        if (!deleted) {
            res.status(404).json({ message: "Store not found"});
            return;
        }
        res.status(200).json({ message: "Store deleted successfully"});
        return;
    } catch (error) {
        console.error("Error deleting store:", error);
        res.status(500).json({ message: "Error deleting store", error});
        return;
    }
};
export const inviteStaff = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email } = req.body;
        const storeId = req.params;
        const vendorId = req.user?.id;
        const store = await Store.findById(storeId);
        if (!store || store.vendor.toString() !== vendorId) {
            res.status(404).json({ message: "Not authorized for this store"});
            return;
        }
        if (
            store.staff.some(id => id.toString() === req.user!.id) ||
            store.invites.some(inv => inv.email === email)
        ) {
            res.status(400).json({ message: "User is already staff or already invited" });
            return;
        }

        const token = crypto.randomBytes(24).toString("hex");
        store.invites.push({ email, token, invitedAt: new Date() });
        await store.save();
        // Uncomment the following lines to send an email with the token
//         const inviteLink = `${process.env.FRONTEND_URL}/accept-invite/${token}`;
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Staff Invitation",
//             text: `You have been invited to join the store. Click the link to accept: ${inviteLink}`,
//         };
//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ message: "Staff invited successfully", token });
    } catch (error) {
        console.error("Error inviting staff:", error);
        res.status(500).json({ message: "Error inviting staff", error});
        return;
    }
};

export const acceptInvite = async (req: Request, res: Response): Promise<void> => {
    try{
        const { token, name, password } = req.body as {
            token: string;
            name: string;
            password: string;
        };
        const store = await Store.findOne({ "invites.token": token });
        if (!store) {
            res.status(404).json({ message: "Invalid or expired invite" });
            return;
        }
        const invite = store.invites.find(inv => inv.token === token);
        if (!invite) {
            res.status(400).json({ message: "Invalid or expired invite" });
            return;
          }
        if (invite.acceptedAt) {
            res.status(404).json({ message: "Invite already used" });
            return;
        }
        let user = await User.findOne({ email: invite.email });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({
                name,
                email: invite.email,
                password: hashedPassword,
                role: "staff",
            }as IUser);
        }
        store.staff.push(user._id as any);
        invite.acceptedAt = new Date();
        await store.save();
        res.status(200).json({ message: "Staff added successfully" });

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, 
            process.env.JWT_SECRET!, 
            { expiresIn: "1d" });
//         store.invites.push({ email, token, invitedAt: new Date() });
//         await store.save();
        res.status(200).json({ message: "Staff invited successfully", token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
         });
    } catch (error) {
        console.error("Accept invite error:", error);
        res.status(500).json({ message: "Error inviting staff", error});
    }
};