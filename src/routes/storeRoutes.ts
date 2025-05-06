import { Router } from "express";
import { createStore, 
    getMyStore, 
    updateStore, 
    deleteStore } from "../controllers/storeController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin, isStaff, isVendor } from "../middleware/roles";

const router = Router();

router.use(protect, isVendor); // Apply middleware to all routes
router.post("/", protect, createStore);
router.get("/", protect, getMyStore);
router.put("/:id", protect, updateStore);
router.delete("/:id", protect, deleteStore);

export default router;