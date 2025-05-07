import { Request, Response } from "express";
import Order, {IOrder} from "../models/orderModel";
import mongoose from "mongoose";
import Product, {IProduct} from "../models/productModel";


export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try{
        const { items, 
            customerName, 
            customerEmail, 
            customerPhone } = req.body as{
                items: {product: string; quantity: number }[];
                customerName?: string;
                customerEmail?: string;
                customerPhone?: string;
            }
        const storeId = (req.body.storeId as string) || req.user?.id;
        if (!storeId) {
            res.status(400).json({ message: "storeId is required"});
            return;
        } // Assuming the store ID is passed in the request body or can be derived from the user
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "Order must include at least one item."});
            return;
        }
        let totalAmount = 0;
        const orderItems : IOrder["items"] = [];

        for ( const { product: prodId, quantity} of items) {
            const productDoc = await Product.findById(prodId).exec();
            if (!productDoc) {
                res.status(404).json({ message: `Product ${prodId} not found`});
                return;
            }
            // const prod = productDoc;
            // const prod : IProduct = productDoc;
            const { _id: productId, price: unitPrice, quantity: stock } = productDoc as IProduct;
            if (stock < quantity) {
                res.status(400).json({ message: `Insufficient stock for product ${productDoc.name}`});
                return;
            }
            productDoc.quantity = stock - quantity;
            await productDoc.save(); 
            orderItems.push({
                product: productId,
                quantity,
                price: unitPrice
            });
            totalAmount += unitPrice * quantity;
        }
       
        const newOrder = await Order.create({
            items: orderItems, 
            customerName,
            customerEmail,
            customerPhone,
            store: storeId,
            totalAmount,
        });
        
        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creating orders:", error);
        res.status(500).json({ message: "Error creating orders", error });
        return;
    }
};
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try{
        const storeId = req.query.storeId as string;
        const filter = storeId ? { store: storeId } : {};
        const orders = await Order.find(filter).populate("items.product").exec();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders"});
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try{
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate("items.product").exec();
        if (!order) {
            res.status(404).json({ message: "Order not found"});
            return;
        }
        res.json(order);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders"});
    }
};
export const updateOrder = async (req: Request, res: Response): Promise<void> => { 
    try{
        const orderId = req.params.id;
        const { status: newStatus } = req.body as {status?: IOrder["status"]};
        if (!newStatus) {
            res.status(400).json({ message: "Status is required"});
            return;
        }
        const validStatuses: IOrder["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(newStatus)) {
            res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`});
            return;
        }
        const updated = await Order.findByIdAndUpdate(
            orderId,
            {$set: { status: newStatus } },
            { new: true, runValidators: true}       
        );
        if (!updated) {
            res.status(404).json({ message: "Order not found"});
            return;
        }
        res.status(200).json(updated);
        return;
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Error updating order", error});
        return;
    }
};
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try{
        const orderId = req.params.id;
        const deleted = await Order.findByIdAndDelete(orderId).exec();
        if (!deleted) {
            res.status(404).json({ message: "Order not found"});
            return;
        }
        res.status(200).json({ message: "Order deleted successfully"});
        return;
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error});
        return;
    }
};