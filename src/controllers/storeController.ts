import { Request, Response } from "express";
import Store from "../models/storeModel";

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