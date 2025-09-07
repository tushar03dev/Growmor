import express from 'express';
import { Address } from "../models/model.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/',authMiddleware,async (req, res) => {
    try {
        console.log("hii")
        const userId = req.user.id;
        if(!userId){
            return res.status(401).send('User Not Found');
        }

        // find addresses for this user
        const addresses = await Address.find({ userId: userId });

        if (!addresses || addresses.length === 0) {
            return res.status(200).json({ message: "No addresses found", addresses: [] });
        }

        return res.status(200).json({ addresses });
    } catch (err) {
        console.error("❌ Error fetching addresses:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// helper: escape user input for regex
const escapeRegex = (str = "") =>
    String(str).replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const {
            firstName,
            lastName,
            street,
            city,
            state,
            phone,
            pincode,
            country,
            isDefault,
        } = req.body;

        // minimal validations
        if (!street) {
            return res.status(400).json({ message: "street is required" });
        }
        if (!city || !country) {
            return res.status(400).json({ message: "city and country are required" });
        }

        const normalizedStreet = street.trim();

        // Build duplicate-matching conditions
        const conditions = [{ userId }];

        const providedFields = {
            firstName,
            lastName,
            phone,
            street: normalizedStreet,
            city,
            state,
            pincode,
            country,
        };

        Object.entries(providedFields).forEach(([key, value]) => {
            if (value !== undefined && value !== null && String(value).trim() !== "") {
                conditions.push({
                    [key]: new RegExp(`^${escapeRegex(String(value).trim())}$`, "i"),
                });
            }
        });

        let existing = null;
        if (conditions.length > 1) {
            console.log("[addresses] duplicate check conditions:", conditions);
            existing = await Address.findOne({ $and: conditions }).lean();
        } else {
            console.log("[addresses] no identifying fields provided, skipping duplicate check");
        }

        if (existing) {
            console.log("[addresses] duplicate found:", existing._id);
            if (isDefault && !existing.isDefault) {
                await Address.updateMany({ userId }, { isDefault: false });
                const updated = await Address.findByIdAndUpdate(
                    existing._id,
                    { isDefault: true },
                    { new: true }
                ).lean();
                return res
                    .status(200)
                    .json({ message: "Address already existed but was set as default", address: updated });
            }

            return res.status(409).json({
                message: "Duplicate address found",
                address: existing,
            });
        }

        // Handle default logic
        const existingAddresses = await Address.find({ userId }).lean();
        let makeDefault = false;
        if (existingAddresses.length === 0 || isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
            makeDefault = true;
        }

        const newAddress = new Address({
            userId,
            firstName,
            lastName,
            phone,
            street: normalizedStreet,
            city,
            state,
            pincode,
            country,
            isDefault: makeDefault,
        });

        await newAddress.save();

        console.log("[addresses] address created:", newAddress._id);
        return res
            .status(201)
            .json({ message: "Address added successfully", address: newAddress });
    } catch (err) {
        console.error("❌ Error adding address:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/:id", authMiddleware,async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, userId }, // make sure it belongs to the logged-in user
            req.body,
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address updated", address: updatedAddress });
    } catch (err) {
        console.error("❌ Error updating address:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.delete("/:id", authMiddleware,async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const deleted = await Address.findOneAndDelete({ _id: id, userId });

        if (!deleted) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address deleted" });
    } catch (err) {
        console.error("❌ Error deleting address:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.patch("/:id/default", authMiddleware,async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // first unset any existing default address for this user
        await Address.updateMany({ userId }, { isDefault: false });

        // now set the selected one as default
        const defaultAddress = await Address.findOneAndUpdate(
            { _id: id, userId },
            { isDefault: true },
            { new: true }
        );

        if (!defaultAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Default address set", address: defaultAddress });
    } catch (err) {
        console.error("❌ Error setting default address:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;

