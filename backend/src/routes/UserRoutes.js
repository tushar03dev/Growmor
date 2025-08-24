import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/users/:id", authMiddleware, userController.getUserProfile);
router.put("/users/:id", authMiddleware, userController.updateUserProfile);

export default router;
