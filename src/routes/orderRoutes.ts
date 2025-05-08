import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {isVendor} from "../middleware/roles";
import { createOrder, 
    getMyOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder } from "../controllers/orderController";


const router = Router();
router.use(protect);

router.post("/", isVendor, createOrder);
router.get("/", isVendor, getMyOrders);
router.get("/:id", isVendor, getOrderById);
router.put("/:id", isVendor, updateOrder);
router.delete("/:id", isVendor, deleteOrder);

export default router;
// This code defines the routes for order-related operations in an Express application.