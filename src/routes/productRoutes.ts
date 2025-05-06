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
router.put("/:id", isVendor, updateProduct);
router.delete("/:id", isVendor, deleteProduct);

export default router;
// This code defines the routes for product-related operations in an Express application.

