const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js")
const orderController = require("../controllers/orderController.js")


router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);
router.get('/orders/user', authMiddleware, orderController.getUserOrders);
// router.get('/orders', authMiddleware, orderController.getAllOrders);          // admin only
// router.put('/orders/:id', authMiddleware, orderController.updateOrderStatus);


module.exports = router;
