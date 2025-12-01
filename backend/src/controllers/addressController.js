import prisma from "../utils/prisma.js";
const normalize = (str = "") => str.trim().toLowerCase();

export const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const addresses = await prisma.address.findMany({
            where: { userId },
        });

        if (addresses.length === 0) {
            return res.status(200).json({ message: "No addresses found", addresses: [] });
        }

        return res.status(200).json({ addresses });
    } catch (err) {
        console.error("Error fetching addresses:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            firstName,
            lastName,
            phone,
            street,
            city,
            state,
            pincode,
            country,
            isDefault,
        } = req.body;

        if (!street || !city || !country) {
            return res.status(400).json({
                message: "street, city and country are required",
            });
        }

        const streetNorm = normalize(street);

        // Check duplicate address (strict match)
        const existing = await prisma.address.findFirst({
            where: {
                userId,
                street: streetNorm,
                city: normalize(city),
                country: normalize(country),
                firstName: firstName ? normalize(firstName) : undefined,
                lastName: lastName ? normalize(lastName) : undefined,
                phone: phone ? normalize(phone) : undefined,
                state: state ? normalize(state) : undefined,
                pincode: pincode ? normalize(pincode) : undefined,
            },
        });

        if (existing) {
            // If duplicate exists but user sets it as default
            if (isDefault && !existing.isDefault) {
                await prisma.address.updateMany({
                    where: { userId },
                    data: { isDefault: false },
                });

                const updated = await prisma.address.update({
                    where: { id: existing.id },
                    data: { isDefault: true },
                });

                return res.status(200).json({
                    message: "Address already existed but set as default",
                    address: updated,
                });
            }

            return res.status(409).json({
                message: "Duplicate address found",
                address: existing,
            });
        }

        // Handle default address logic
        const userAddresses = await prisma.address.findMany({ where: { userId } });

        let makeDefault =
            userAddresses.length === 0 || isDefault === true ? true : false;

        if (makeDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId,
                firstName,
                lastName,
                phone,
                street: streetNorm,
                city: normalize(city),
                state: state ? normalize(state) : "",
                pincode: pincode ? normalize(pincode) : "",
                country: normalize(country),
                isDefault: makeDefault,
            },
        });

        return res.status(201).json({
            message: "Address added successfully",
            address: newAddress,
        });
    } catch (err) {
        console.error("❌ Error adding address:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = Number(req.params.id);

        const updated = await prisma.address.updateMany({
            where: { id: addressId, userId },
            data: req.body,
        });

        if (updated.count === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        const address = await prisma.address.findUnique({
            where: { id: addressId },
        });

        res.json({ message: "Address updated", address });
    } catch (err) {
        console.error("❌ Error updating address:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = Number(req.params.id);

        const deleted = await prisma.address.deleteMany({
            where: { id: addressId, userId },
        });

        if (deleted.count === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address deleted" });
    } catch (err) {
        console.error("Error deleting address:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


export const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = Number(req.params.id);

        // 1. Remove default from all addresses
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });

        // 2. Set default for the chosen one
        const updated = await prisma.address.updateMany({
            where: { id: addressId, userId },
            data: { isDefault: true },
        });

        if (updated.count === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        const defaultAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        res.json({
            message: "Default address set",
            address: defaultAddress,
        });
    } catch (err) {
        console.error("Error setting default address:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
