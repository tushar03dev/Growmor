import express from 'express';
import authMiddleware from "../middlewares/authMiddleware.js";
import {createOrder} from "../controllers/orderController.js";
import {verifyPayment} from "../controllers/paymentController.js";
const router = express.Router();

router.post('/create-order', authMiddleware,createOrder);

router.post('/verify', authMiddleware,verifyPayment);

export default router;