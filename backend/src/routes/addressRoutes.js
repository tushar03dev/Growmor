import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);
router.patch("/:id/default", authMiddleware, setDefaultAddress);

export default router;
