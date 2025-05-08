import { Router } from "express";
import { createProduct, 
    getMyProducts,
    getProductById, 
    updateProduct, 
    deleteProduct} from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin, isStaff, isVendor } from "../middleware/roles";

const router = Router();

router.use(protect);
router.post("/", isVendor, createProduct);
router.get("/", isVendor, getMyProducts);
router.get("/:id", isVendor, getProductById);
// router.get("/store/:id", isVendor, getMyProducts); // Assuming you want to get products by store ID
router.put("/:id", isVendor, updateProduct);
router.delete("/:id", isVendor, deleteProduct);

export default router;
// This code defines the routes for product-related operations in an Express application.

