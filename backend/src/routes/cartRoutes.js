const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js")
const cartController = require("../controllers/cartController.js")

// Cart Routes
router.get('/cart', authMiddleware, cartController.getCart);
router.post('/cart', authMiddleware, cartController.addItemToCart);
router.put('/cart/:itemId', authMiddleware, cartController.updateCartItem);
router.delete('/cart/:itemId', authMiddleware, cartController.removeItemFromCart);
router.delete('/cart', authMiddleware, cartController.clearCart);

module.exports = router;
