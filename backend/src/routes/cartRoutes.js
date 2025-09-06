import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import cartController from "../controllers/cartController.js";

const router = express.Router();

// Cart Routes
router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addItemToCart);
router.put("/:itemId", authMiddleware, cartController.updateCartItem);
router.delete("/:itemId", authMiddleware, cartController.removeItemFromCart);
router.delete("/", authMiddleware, cartController.clearCart);

export default router;
