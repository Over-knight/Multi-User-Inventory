import { Request, Response } from "express";
import product from "../models/productModel";
import mongoose from "mongoose";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, price, description, quantity, threshold, sku, category, imageUrls} = req.body;
        const storeId = req.body.storeId || req.user?.id; // Assuming the store ID is passed in the request body or can be derived from the user
        const store = await product.create({
            name,
            price,
            sku,
            description,
            quantity,
            threshold,
            category,
            store: storeId,
            imageUrls,
        });
        res.status(201).json(store);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product", error });
        return;
    }
};

export const getMyProducts = async (req: Request, res: Response): Promise<void> => {
    try{
        const storeId = req.query.storeId as string;
        const filter = storeId ? { store: storeId } : {};
        const products = await product.find(filter);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products"});
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    console.log("🔥 getProductById called with id =", req.params.id);
    try{
        const productId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(productId)){
            console.error(`Invalid product ID: ${productId}`);
            res.status(400).json({ message: "Invalid product ID"});
            return;
        }
        const products = await product.findById({ productId});
        if (!products) {
            console.error(`Product with ID ${productId} not found`);
            res.status(404).json({ message: "Product not found"});
            return;
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching products"});
        return;
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => { 
    try{
        const productId = req.params.id;
        const updates = req.body;
        const updated = await product.findByIdAndUpdate(
            productId,
            {$set: updates},
            { new: true, runValidators: true}       
        );
        if (!updated) {
            res.status(404).json({ message: "Product not found"});
            return;
        }
        res.status(200).json(updated);
        return;
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product", error});
        return;
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try{
        const productId = req.params.id;
        const deleted = await product.findByIdAndDelete(productId);

        if (!deleted) {
            res.status(404).json({ message: "Product not found"});
            return;
        }
        res.status(200).json({ message: "Product deleted successfully"});
        return;
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error});
        return;
    }
};